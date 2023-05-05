import styles from "./index.module.css";
import React, { useContext, useEffect } from "react";
import { Loading } from "@nextui-org/react";
import AiLOGO from "../../icons/bot.svg";
import AiLOGODark from "../../icons/bot_dark.svg";
import Image from "next/image";
import { ChatMessage } from "@/app/pages/chat/index";
import MarkdownText, { copyToClipboard } from "@/app/pages/chat/markdown-text";
import { context } from "@/app/hooks/context-mobile";
import { util } from "@/app/utils/util";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-hot-toast";
import { Dropdown, MenuProps } from "antd";

const BotChatTextItemView = (props: {
  deleteItem: () => void;
  onCompleted?: () => void;
  children: ChatMessage;
  id: number;
}) => {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  const copyO = {
    label: "复制",
    key: "1",
    onClick: () => {
      var selection = window.getSelection()?.toString() ?? "";
      if (selection.trim().length > 0) {
        copyToClipboard(selection);
      } else {
        copyToClipboard(props.children.data.content);
      }
    },
  };

  const deleteO = {
    label: "删除",
    key: "2",
    onClick: () => props.deleteItem(),
  };

  const addNoteO = {
    label: (
      <div style={{ color: "var(--nextui-colors-primary)" }}>
        保存到随便记记
      </div>
    ),
    key: "3",
    onClick: () => {
      const temp: ChatMessage[] =
        JSON.parse(localStorage.getItem("historyList" + 2) || "[]") || [];
      temp.push(props.children);
      localStorage.setItem("historyList" + 2, JSON.stringify(temp));
      toast.success(" 已保存到随便记记");
    },
  };

  const completeO = {
    label: "完成",
    key: "4",
    onClick: () => {
      props.onCompleted && props.onCompleted();
      refreshContextMenu();
    },
  };

  const [operations, setOperations] = React.useState<MenuProps["items"]>([]);

  function refreshContextMenu() {
    switch (props.id) {
      case 2:
        const temp: MenuProps["items"] = [copyO, deleteO];
        if (
          !props.children.data.content.startsWith("~~") &&
          !props.children.data.content.endsWith("~~")
        ) {
          temp.push({ type: "divider" });
          temp.push(completeO);
        }
        setOperations(temp);
        break;
      default:
        setOperations([copyO, deleteO, { type: "divider" }, addNoteO]);
        break;
    }
  }
  useEffect(() => {
    refreshContextMenu();
  }, [props.id]);
  return (
    <div
      className={styles.message}
      style={{
        gap: 8,
        paddingLeft: isMobile ? 12 : 24,
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Image
        className={styles.avatar}
        src={isDarkMode ? AiLOGODark : AiLOGO}
        style={{
          width: 36,
          height: 36,
          position: "sticky",
          borderRadius: 14,
          boxShadow: "0 2px 4px rgb(0 0 0 / 6%), 0 0 2px rgb(0 0 0 / 2%)",
          top: 92,
        }}
        alt={"chatgpt"}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 4,
          alignItems: "start",
        }}
      >
        {props.children.time && (
          <div
            style={{
              color: "#a0a0a0",
              fontSize: 12,
              gap: 8,
              display: "flex",
              alignItems: "center",
            }}
          >
            {util.getDateFormat(props.children.time)}
          </div>
        )}
        <Dropdown
          disabled={
            operations?.length === 0 || props.children.time == undefined
          }
          overlayStyle={{
            border: isDarkMode
              ? "1px solid rgba(57, 58, 60, 1)"
              : "1px solid #eeeeee",
            borderRadius: 12,
          }}
          menu={{
            items: operations,
          }}
          trigger={["contextMenu"]}
        >
          <div className={styles.bot}>
            {props.children.data.content == "loading" && (
              <Loading size={"xs"} type={"points"} />
            )}
            {props.children.data.content != "loading" && (
              <MarkdownText>{props.children.data.content}</MarkdownText>
            )}
          </div>
        </Dropdown>
      </div>
      {/*<div style={{ width: 90 }} />*/}
    </div>
  );
};

// eslint-disable-next-line react/display-name
const BotChatTextView = React.memo(
  (props: {
    children: ChatMessage;
    deleteItem: () => void;
    id: number;
    onCompleted?: () => void;
  }) => {
    return (
      <BotChatTextItemView
        deleteItem={props.deleteItem}
        id={props.id}
        onCompleted={props.onCompleted}
      >
        {props.children}
      </BotChatTextItemView>
    );
  }
);
export default BotChatTextView;
