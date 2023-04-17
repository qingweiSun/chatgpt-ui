import styles from "./index.module.css";
import React from "react";
import { Loading } from "@nextui-org/react";
import AiLOGO from "../../icons/bot.svg";
import Image from "next/image";
import { ChatMessage } from "@/app/pages/chat/index";
import MarkdownText from "@/app/pages/chat/markdown-text";

const BotChatTextView = (props: { children: ChatMessage }) => {
  return (
    <div
      style={{
        marginLeft: 12,
        marginRight: 12,
        gap: 8,
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Image
        src={AiLOGO}
        style={{
          width: 40,
          height: 40,
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
        <div style={{ color: "#a0a0a0", fontSize: 12 }}>
          {props.children.time}
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

export default BotChatTextView;
