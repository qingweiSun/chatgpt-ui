import styles from "./index.module.css";
import { Button, Input, Navbar } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import UserView from "@/app/pages/chat/user-chat-view";
import {
  ChevronUp,
  CloseSquare,
  Delete,
  Download,
  EditSquare,
  Filter,
  MoreSquare,
  Send,
} from "react-iconly";
import toast from "react-hot-toast";
import useStateSync from "@/app/hooks/use-state-with-call";
import { generateMessage } from "@/app/pages/chat/api/generate";
import BotChatTextView from "@/app/pages/chat/bot-chat-text-view";
import { useScroll } from "@/app/hooks/use-scroll";
import { SelectView } from "@/app/components/delete-view";
import EditName from "@/app/components/edit-name";
import IdContext from "@/app/hooks/use-chat-id";
import MobileSlider from "@/app/components/slider/mobile";
import { exportMarkdown } from "@/app/components/setting";
import PromptView from "@/app/components/prompt-view";
import LargeInput from "@/app/components/large-input";
import { Tooltip } from "antd";

export interface ChatMessage {
  data: GptMessage;
  time?: string;
}

export interface GptMessage {
  role: "system" | "user" | "assistant";
  content: string | "loading";
}

export default function ChatView() {
  const [name, setName] = useState("");
  const chatId = useRef(-1);

  const [prompt, setPrompt] = useStateSync<ChatMessage>({
    data: {
      role: "system",
      content: "你是AI小助手",
    },
  });
  const [messages, setMessages] = useStateSync<ChatMessage[]>([prompt]);
  const { current, setId } = useContext(IdContext);

  useEffect(() => {
    if (chatId.current != current.id || name != current.name) {
      chatId.current = current.id;
      const list =
        JSON.parse(localStorage.getItem("historyList" + current.id) || "[]") ||
        [];
      if (list.length == 0) {
        setMessages([]);
      } else {
        setMessages(list);
      }
      setName(current.name);
    }
  }, [current.id, current.name]);
  const scrollRef = useRef(null); //监听滚动
  useScroll(scrollRef);
  const inputText = useRef<HTMLTextAreaElement>();
  const [loading, setLoading] = useStateSync(false);
  const [controller, setController] = useState<AbortController>(); //中断请求

  useEffect(() => {
    if (current.id) {
      localStorage.setItem(
        "historyList" + current.id,
        JSON.stringify(messages)
      );
    }
    if (name === "新的会话") {
      const tempName =
        messages.find((e) => {
          return e.data.role === "user";
        })?.data.content || "";

      if (tempName != "") {
        setName(tempName);
        setId({ id: current.id || -1, name: tempName });
      }
    }
  }, [messages]);

  const send = async () => {
    if (loading) {
      if (controller) {
        controller.abort();
      }
      toast.error("请求已取消");
      setLoading(false);
      return;
    }
    if (inputText.current?.value === "") {
      toast.error("请输入内容");
      return;
    }
    setLoading(true);
    const newMessage: ChatMessage[] = [
      ...messages,
      {
        data: { role: "user", content: inputText.current?.value || "" },
        time: new Date().toLocaleString(),
      },
    ];
    await setMessages(newMessage, async (newState) => {
      const controllerValue = new AbortController();
      setController(controllerValue);
      await generateMessage(newState, controllerValue, (newMessages) => {
        setMessages(newMessages);
      });
      setLoading(false);
      // @ts-ignore
      inputText.current.value = "";
    });
  };

  const MessageViewList = useMemo(() => {
    return messages.map((message, index) => {
      return (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent:
              message.data.role == "user" ? "flex-end" : "flex-start",
          }}
        >
          {message.data.role != "assistant" ? (
            <UserView>{message}</UserView>
          ) : (
            <BotChatTextView>{message}</BotChatTextView>
          )}
        </div>
      );
    });
  }, [messages]);

  return (
    <div className={styles.container}>
      <Navbar
        className={styles.navbar}
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
            <div className={styles.name}>{name || "新的会话"}</div>
            <div style={{ fontSize: 13 }}>共{messages.length}条记录</div>
          </div>
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item>
            <div className={styles.toggle} onClick={() => {}}>
              <MobileSlider>
                <div className={styles.link}>
                  <MoreSquare set="curved" size={22} />
                </div>
              </MobileSlider>
            </div>
          </Navbar.Item>
          <Navbar.Item>
            <EditName
              name={name || "新的会话"}
              setName={(text) => {
                setName(text);
                setId({ id: current.id || -1, name: text });
              }}
            >
              <Tooltip title="重命名会话" color={"blue"}>
                <div className={styles.link}>
                  {/*<Edit set="light" size={22} />*/}
                  <EditSquare set="curved" size={22} />
                </div>
              </Tooltip>
            </EditName>
          </Navbar.Item>
          <Navbar.Item>
            <div className={styles.link} onClick={() => {}}>
              <Tooltip title={"本次会话配置"} color={"blue"}>
                <Filter set="curved" size={22} />
              </Tooltip>
            </div>
          </Navbar.Item>
          <Navbar.Item>
            <SelectView
              onDelete={() => {
                setMessages([]);
                localStorage.removeItem("historyList" + current.id);
                toast.success("已重置");
              }}
              title={"提示"}
              description={"确定要重置此会话吗？"}
              placement={"bottom-right"}
              className={styles.link}
            >
              <Tooltip title="重置会话" color={"blue"}>
                <Delete set="curved" size={22} />
              </Tooltip>
            </SelectView>
          </Navbar.Item>
          <Navbar.Item>
            <div
              className={styles.link}
              onClick={() => {
                exportMarkdown({ messages });
              }}
            >
              <Tooltip title="导出Markdown" color={"blue"}>
                <Download set="curved" size={22} />
              </Tooltip>
            </div>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
        ref={scrollRef}
      >
        <div />
        {messages.length == 0 && (
          <PromptView
            setPrompt={(text) => {
              setPrompt(
                {
                  data: {
                    role: "system",
                    content: text,
                  },
                },
                (newState) => {
                  setMessages([newState]);
                }
              );
            }}
          />
        )}
        {MessageViewList}
        <div style={{ height: 140 }} />
        <div id={"home_end"} />
      </div>
      <div className={styles.bottom}>
        <Input
          placeholder="请输入你想提问的问题..."
          className={styles.input}
          color="primary"
          borderWeight={"light"}
          // @ts-ignore
          ref={inputText}
          fullWidth
          bordered
          css={{ padding: 0 }}
          contentRightStyling={false}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.altKey) {
              e.preventDefault();
              // @ts-ignore
              const { selectionStart, selectionEnd, value } = e.target;
              const textBeforeCursor = value.substring(0, selectionStart);
              const textAfterCursor = value.substring(
                selectionEnd,
                value.length
              );
              // @ts-ignore
              inputText.current.value = `${textBeforeCursor}\n${textAfterCursor}`;
              // 将光标移到新行的开头
              // @ts-ignore
              e.target.selectionStart = selectionEnd + 1;
              // @ts-ignore
              e.target.selectionEnd = selectionEnd + 1;
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (!loading) {
                send();
              }
            }
          }}
          // contentLeftStyling={false}
          // contentLeft={
          //   <a>
          //     <Search set="curved" size={"small"} />
          //   </a>
          // }
          contentRight={
            <LargeInput
              className={styles.link}
              setText={(text) => {
                // @ts-ignore
                inputText.current.value = text;
                send();
              }}
            >
              <ChevronUp set="curved" size={20} />
            </LargeInput>
          }
        />

        <Button auto onPress={send} color={loading ? "error" : "primary"}>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? "停止" : "发送"}
            {loading ? (
              <CloseSquare set="curved" size={"small"} />
            ) : (
              <Send set="curved" size={"small"} />
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
