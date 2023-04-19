import styles from "./index.module.css";
import React from "react";
import MarkdownText from "@/app/pages/chat/markdown-text";
import { ChatMessage } from "@/app/pages/chat/index";
import Image from "next/image";
import HeadImage from "../../icons/head.jpeg";
import UserImage from "../../images/avatar.jpg";
const UserView = (props: { children: ChatMessage }) => {
  return (
    <div
      className={styles["user-message"]}
      style={{
        paddingRight: 12,
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
            backgroundColor: "#ffffff",
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
              }}
            />
          }
        </div>
      </div>
      <div className={styles.user}>
        <MarkdownText>{props.children.data.content}</MarkdownText>
      </div>
    </div>
  );
};
export default UserView;
