import styles from "./index.module.css";
import React from "react";
import MarkdownText from "@/app/pages/chat/markdown-text";
import { Avatar } from "@nextui-org/react";
import {ChatMessage} from "@/app/pages/chat/index";

const UserView = (props: { children: ChatMessage }) => {
  return (
    <div
      style={{
        marginLeft: 12,
        marginRight: 12,
        gap: 8,
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <Avatar
        squared
        style={{ zIndex: 0 }}
        icon={<div style={{ fontSize: 22 }}>🤠</div>}
      />
      <div className={styles.user}>
        <MarkdownText>{props.children.data.content}</MarkdownText>
      </div>
      <div style={{ width: 90 }} />
    </div>
  );
};
export default UserView;
