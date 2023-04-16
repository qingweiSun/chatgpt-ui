import styles from "./index.module.css";
import { Button, Input, Navbar, Tooltip } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import BotChatTextView from "@/app/pages/chat/bot-chat-text-view";
import UserView from "@/app/pages/chat/user-chat-view";
import { ChevronUp, Delete, Download, Edit, Send } from "react-iconly";
import toast from "react-hot-toast";
import useStateSync from "@/app/hooks/use-state-with-call";
import { generateMessage } from "@/app/pages/chat/api/generate";

export interface ChatMessage {
  data: GptMessage;
  time?: string;
}

export interface GptMessage {
  role: "system" | "user" | "assistant";
  content: string | "loading";
}

export default function ChatView(props: { id?: number }) {
  const [messages, setMessages] = useStateSync<ChatMessage[]>([
    {
      data: {
        role: "system",
        content: "AI小助手",
      },
    },
  ]);
  const inputText = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (props.id) {
      const list =
        JSON.parse(localStorage.getItem("historyList" + props.id) || "[]") ||
        [];
      if (list.length > 0) {
        setMessages(list);
      }
    }
  }, [props.id]);

  useEffect(() => {
    if (props.id) {
      localStorage.setItem("historyList" + props.id, JSON.stringify(messages));
    }
  }, [messages]);

  const send = async () => {
    if (inputText.current?.value === "") {
      toast.error("请输入内容");
      return;
    }

    const newMessage: ChatMessage[] = [
      ...messages,
      {
        data: { role: "user", content: inputText.current?.value || "" },
        time: new Date().toLocaleString(),
      },
    ];
    await setMessages(newMessage, (newState) => {
      generateMessage(newState, (newMessages) => {
        console.log("newMessages", newMessages);
        setMessages(newMessages);
      });
    });
  };

  return (
    <div className={styles.container}>
      <Navbar
        variant="sticky"
        maxWidth={"fluid"}
        disableShadow
        containerCss={{
          backgroundColor: "rgba(247, 247, 247, 0.7) !important",
          borderBottom: "1px solid #eeeeee",
          boxShadow: "0 2px 4px rgb(0 0 0 / 1%)",
        }}
      >
        <Navbar.Brand>
          <div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 20,
                display: "flex",
                alignItems: "center",
              }}
            >
              {/*<Navbar.Toggle aria-label="toggle navigation" />*/}
              新的聊天 <Edit set="curved" size={18} />
            </div>
            <div style={{ fontSize: 13 }}>共11条3录</div>
          </div>
        </Navbar.Brand>
        <Navbar.Content>
          <Tooltip
            content={"重置"}
            placement={"left"}
            trigger="hover"
            color={"primary"}
          >
            <Navbar.Item>
              <div
                className={styles.link}
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem("historyList" + props.id);
                }}
              >
                <Delete set="curved" size={22} />
              </div>
            </Navbar.Item>
          </Tooltip>
          <Tooltip
            content={"导出"}
            placement={"left"}
            trigger="hover"
            color={"primary"}
          >
            <Navbar.Item>
              <div className={styles.link}>
                <Download set="curved" size={22} />
              </div>
            </Navbar.Item>
          </Tooltip>
        </Navbar.Content>
      </Navbar>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div />
        {messages.map((item, index) => {
          return (
            <div
              key={index}
              className={styles.chatItem}
              style={{
                display: "flex",
                justifyContent:
                  item.data.role == "user" ? "flex-end" : "flex-start",
              }}
            >
              {item.data.role == "user" ? (
                <UserView>{item}</UserView>
              ) : (
                <BotChatTextView>{item}</BotChatTextView>
              )}
            </div>
          );
        })}
        <div style={{ height: 140 }} />
      </div>
      <div className={styles.bottom}>
        <Input
          placeholder="请输入你想提问的问题（⌥+Return换行）..."
          className={styles.input}
          color="primary"
          autoFocus
          borderWeight={"light"}
          // @ts-ignore
          ref={inputText}
          fullWidth
          bordered
          css={{ padding: 0 }}
          contentRightStyling={false}
          // contentLeftStyling={false}
          // contentLeft={
          //   <a>
          //     <Search set="curved" size={"small"} />
          //   </a>
          // }
          contentRight={
            <Button auto light>
              <ChevronUp set="curved" size={20} />
            </Button>
          }
        />

        <Button auto onPress={send}>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            发送
            <Send set="curved" size={"small"} />
          </div>
        </Button>
      </div>
    </div>
  );
}
