import { context } from "@/app/hooks/context-mobile";
import { ChatMessage } from "@/app/pages/chat/index";
import MarkdownText, { copyToClipboard } from "@/app/pages/chat/markdown-text";
import { util } from "@/app/utils/util";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import UserImage from "../../images/av1.png";
import styles from "./index.module.css";
import { useMediaQuery } from "react-responsive";
import { Dropdown, MenuProps } from "antd";
import toast from "react-hot-toast";
//https://www.iconfont.cn/illustrations/detail?spm=a313x.7781069.1998910419.d9df05512&cid=43905 头像
const UserItemView = (props: {
  deleteItem: () => void;
  children: ChatMessage;
  id: number;
  onCompleted?: () => void;
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
        if (props.children.data.role === "user") {
          setOperations([copyO, deleteO, { type: "divider" }, addNoteO]);
        } else {
          setOperations([copyO, deleteO]);
        }
        break;
    }
  }
  useEffect(() => {
    refreshContextMenu();
  }, [props.id]);
  return (
    <div
      className={styles["user-message"]}
      style={{
        paddingRight: isMobile ? 12 : 24,
        gap: 8,
        width: "100%",
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <div className={styles.avatar}>
        <div
          style={{
            zIndex: 0,
            position: "sticky",
            top: 92,
            width: 36,
            height: 36,
            display: "flex",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isDarkMode ? "#1b1b1b" : "#ffffff",
            borderRadius: 14,
            boxShadow: "0 2px 4px rgb(0 0 0 / 6%), 0 0 2px rgb(0 0 0 / 2%)",
          }}
        >
          {
            <Image
              alt={"用户"}
              src={UserImage}
              objectFit={"cover"}
              style={{
                width: 36,
                height: 36,
                padding: 4,
              }}
            />
          }
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 4,
          alignItems: "end",
        }}
      >
        {props.children.time && (
          <div
            style={{
              color: "#a0a0a0",
              fontSize: 12,
              gap: 8,
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
            }}
          >
            {util.getDateFormat(props.children.time)}
          </div>
        )}
        <Dropdown
          overlayStyle={{
            border: isDarkMode
              ? "1px solid rgba(57, 58, 60, 1)"
              : "1px solid rgba(0, 0, 0, 0.15)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow:
              "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
          }}
          menu={{
            items: operations,
          }}
          trigger={isMobile ? ["click"] : ["contextMenu"]}
        >
          <div className={styles.user}>
            <MarkdownText>{props.children.data.content}</MarkdownText>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
//export default UserView;

// eslint-disable-next-line react/display-name
const UserView = React.memo(
  (props: {
    deleteItem: () => void;
    children: ChatMessage;
    id: number;
    onCompleted?: () => void;
  }) => {
    return (
      <UserItemView
        deleteItem={props.deleteItem}
        id={props.id}
        onCompleted={props.onCompleted}
      >
        {props.children}
      </UserItemView>
    );
  }
);
export default UserView;
