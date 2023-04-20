import styles from "./index.module.css";
import React from "react";
import { Loading } from "@nextui-org/react";
import AiLOGO from "../../icons/bot.svg";
import Image from "next/image";
import { ChatMessage } from "@/app/pages/chat/index";
import MarkdownText, { copyToClipboard } from "@/app/pages/chat/markdown-text";

const BotChatTextItemView = (props: { children: ChatMessage }) => {
  return (
    <div
      className={styles.message}
      style={{
        gap: 8,
        paddingLeft: 12,
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Image
        className={styles.avatar}
        src={AiLOGO}
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
          gap: 8,
          alignItems: "start",
        }}
      >
        <div
          style={{
            color: "#a0a0a0",
            fontSize: 12,
            gap: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.children.time}
          {props.children.time && (
            <div
              className={styles["chat-message-top-action-item"]}
              onClick={() => copyToClipboard(props.children.data.content)}
            >
              复制
            </div>
          )}
          {/*<div*/}
          {/*  className={styles["chat-message-top-action-item"]}*/}
          {/*  onClick={() => copyToClipboard(String("xx"))}*/}
          {/*>*/}
          {/*  重试*/}
          {/*</div>*/}
        </div>
        <div className={styles.bot}>
          {props.children.data.content == "loading" && (
            <Loading size={"xs"} type={"points"} />
          )}
          {props.children.data.content != "loading" && (
            <MarkdownText>{props.children.data.content}</MarkdownText>
          )}
        </div>
      </div>
      {/*<div style={{ width: 90 }} />*/}
    </div>
  );
};

// eslint-disable-next-line react/display-name
const BotChatTextView = React.memo((props: { children: ChatMessage }) => {
  return <BotChatTextItemView>{props.children}</BotChatTextItemView>;
});
export default BotChatTextView;
