import { context } from "@/app/hooks/context-mobile";
import { ChatMessage } from "@/app/pages/chat/index";
import MarkdownText, { copyToClipboard } from "@/app/pages/chat/markdown-text";
import { util } from "@/app/utils/util";
import Image from "next/image";
import React, { useContext } from "react";
import UserImage from "../../images/avatar.jpg";
import styles from "./index.module.css";
const UserItemView = (props: {
  deleteItem: () => void;
  children: ChatMessage;
}) => {
  const { isMobile } = useContext(context);
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
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
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
        <div className={styles.user}>
          <MarkdownText>{props.children.data.content}</MarkdownText>
        </div>
      </div>
    </div>
  );
};
//export default UserView;

// eslint-disable-next-line react/display-name
const UserView = React.memo(
  (props: { deleteItem: () => void; children: ChatMessage }) => {
    return (
      <UserItemView deleteItem={props.deleteItem}>
        {props.children}
      </UserItemView>
    );
  }
);
export default UserView;
