import styles from "./index.module.css";
import React, { useContext } from "react";
import { Loading } from "@nextui-org/react";
import AiLOGO from "../../icons/bot.svg";
import Image from "next/image";
import { ChatMessage } from "@/app/pages/chat/index";
import MarkdownText, { copyToClipboard } from "@/app/pages/chat/markdown-text";
import { context } from "@/app/hooks/context-mobile";
import { util } from "@/app/utils/util";

const BotChatTextItemView = (props: {
  deleteItem: () => void;
  children: ChatMessage;
}) => {
  const { isMobile } = useContext(context);
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
            <div style={{ display: "flex" }}>
              <div
                className={styles["chat-message-top-action-item"]}
                onClick={() => copyToClipboard(props.children.data.content)}
              >
                复制
              </div>
              <div
                className={styles["chat-message-top-action-item"]}
                onClick={() => props.deleteItem()}
              >
                删除
              </div>
            </div>
          </div>
        )}
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
const BotChatTextView = React.memo(
  (props: { children: ChatMessage; deleteItem: () => void }) => {
    return (
      <BotChatTextItemView deleteItem={props.deleteItem}>
        {props.children}
      </BotChatTextItemView>
    );
  }
);
export default BotChatTextView;
