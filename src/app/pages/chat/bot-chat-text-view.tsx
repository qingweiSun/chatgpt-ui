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
import { Dropdown, MenuProps, Tag } from "antd";
import {
  AddDrawerView,
  EditDrawerView,
} from "@/app/components/edit/edit-drawer";

const BotChatTextItemView = (props: {
  deleteItem: () => void;
  onCompleted?: () => void;
  children: ChatMessage;
  id: number;
  updateItemContent?: (content: string) => void;
  addItem?: (
    content: string,
    isAfter: boolean,
    role: "system" | "user" | "assistant"
  ) => void;
}) => {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [open, setOpen] = React.useState(false);
  const [openAddAfter, setOpenAddAfter] = React.useState(false);
  const [openAddBefore, setOpenAddBefore] = React.useState(false);
  function getOperations() {
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
      label: <div style={{ color: "var(--nextui-colors-error)" }}>删除</div>,
      key: "2",
      onClick: () => props.deleteItem(),
    };
    const editO = {
      label: "编辑",
      key: "5",
      onClick: () => {
        setOpen(true);
      },
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
      label: <div style={{ color: "var(--nextui-colors-primary)" }}>完成</div>,
      key: "4",
      onClick: () => {
        props.onCompleted && props.onCompleted();
        //refreshContextMenu();
      },
    };
    const addAfterO = {
      label: "在后面添加一条",
      key: "6",
      onClick: () => {
        setOpenAddAfter(true);
      },
    };
    const addBeforeO = {
      label: "在前面添加一条",
      key: "7",
      onClick: () => {
        setOpenAddBefore(true);
      },
    };
    const operations: MenuProps["items"] = [];
    switch (props.id) {
      case 1:
        operations.push(copyO);
        operations.push(editO);
        operations.push({ type: "divider" });
        operations.push(addBeforeO);
        operations.push(addAfterO);
        operations.push({ type: "divider" });
        operations.push(deleteO);
        operations.push(addNoteO);
        break;
      case 2:
        operations.push(copyO);
        operations.push(editO);
        operations.push({ type: "divider" });
        operations.push(deleteO);
        if (
          !props.children.data.content.startsWith("~~") &&
          !props.children.data.content.endsWith("~~")
        ) {
          operations.push(completeO);
        }
        break;
      default:
        operations.push(copyO);
        operations.push(editO);
        operations.push({ type: "divider" });
        operations.push(addBeforeO);
        operations.push(addAfterO);
        operations.push({ type: "divider" });
        operations.push(deleteO);
        operations.push(addNoteO);
        break;
    }
    return operations;
  }
  return (
    <>
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
              items: getOperations(),
            }}
            trigger={isMobile ? ["click"] : ["contextMenu"]}
          >
            <div className={styles.bot}>
              {props.children.data.content == "loading" &&
                props.children.search == true && (
                  <div style={{ fontSize: 14 }}>
                    正在联网查询
                    <Loading size={"xs"} type={"points"} />
                  </div>
                )}

              {props.children.data.content == "loading" &&
                props.children.search != true && (
                  <Loading size={"xs"} type={"points"} />
                )}
              {props.children.data.content != "loading" && (
                <MarkdownText>{props.children.data.content}</MarkdownText>
              )}
              {props.children.network && (
                <div
                  style={{
                    fontSize: 13,
                    gap: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontWeight: 500, marginTop: 8 }}>
                    参考链接：
                  </div>
                  {JSON.parse(props.children.network).map(
                    (item: any, index: number) => {
                      return (
                        <div
                          key={item.href}
                          style={{
                            textDecoration: "underline",
                          }}
                        >
                          {item.title}
                          <a
                            onClick={() => {
                              window.open(item.href);
                            }}
                          >
                            [{index + 1}]
                          </a>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </div>
      <EditDrawerView
        content={props.children.data.content}
        setContent={(content) =>
          props.updateItemContent && props.updateItemContent(content)
        }
        open={open}
        title="编辑"
        setOpen={() => {
          setOpen(false);
        }}
      />
      <AddDrawerView
        content={""}
        role="assistant"
        setContent={(content, role) =>
          props.addItem && props.addItem(content, true, role)
        }
        open={openAddAfter}
        setOpen={() => {
          setOpenAddAfter(false);
        }}
      />
      <AddDrawerView
        content={""}
        role="assistant"
        setContent={(content, role) =>
          props.addItem && props.addItem(content, false, role)
        }
        open={openAddBefore}
        setOpen={() => {
          setOpenAddBefore(false);
        }}
      />
    </>
  );
};

// eslint-disable-next-line react/display-name
const BotChatTextView = React.memo(
  (props: {
    children: ChatMessage;
    deleteItem: () => void;
    id: number;
    onCompleted?: () => void;
    updateItemContent?: (content: string) => void;
    addItem?: (
      content: string,
      isAfter: boolean,
      role: "system" | "user" | "assistant"
    ) => void;
  }) => {
    return (
      <BotChatTextItemView
        deleteItem={props.deleteItem}
        id={props.id}
        onCompleted={props.onCompleted}
        updateItemContent={props.updateItemContent}
        addItem={props.addItem}
      >
        {props.children}
      </BotChatTextItemView>
    );
  }
);
export default BotChatTextView;
