import styles from "./index.module.css";
import React from "react";
import MarkdownText from "@/app/pages/chat/markdown-text";
import { ChatMessage } from "@/app/pages/chat/index";

const UserView = (props: { children: ChatMessage }) => {
  return (
    <div
      style={{
        marginLeft: 12,
        marginRight: 12,
        gap: 8,
        width: "100%",
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <div
        style={{
          zIndex: 0,
          position: "sticky",
          top: 92,
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: 14,
          boxShadow: "0 2px 4px rgb(0 0 0 / 6%), 0 0 2px rgb(0 0 0 / 2%)",
        }}
      >
        {<div style={{ fontSize: 22 }}>🤠</div>}
      </div>
      <div className={styles.user}>
        <MarkdownText>{props.children.data.content}</MarkdownText>
      </div>
      <div style={{ width: 90 }} />
    </div>
  );
};
export default UserView;
