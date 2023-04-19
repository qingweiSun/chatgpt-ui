import styles from "./index.module.css";
import { Button, Input, Navbar } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import UserView from "@/app/pages/chat/user-chat-view";
import {
  ChevronUp,
  CloseSquare,
  Delete,
  Download,
  Edit,
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
import GptContext from "@/app/hooks/use-gpt";
import MaxTokensLimit, {
  MaxTokensLimitProps,
} from "@/app/components/max-tokens-limit";
import TextArea from "antd/es/input/TextArea";
import { context } from "@/app/hooks/context-mobile";
import NavbarTItleView from "./view/name-view";
import InputView from "./view/input-view";

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
  const { isMobile } = useContext(context);

  const [questioningMode, setQuestioningMode] = useState<MaxTokensLimitProps>();
  const chatId = useRef(-1);

  const [prompt, setPrompt] = useStateSync<ChatMessage>({
    data: {
      role: "system",
      content: "你是AI小助手",
    },
  });
  const [messages, setMessages] = useStateSync<ChatMessage[]>([prompt]);
  const { current, setId } = useContext(IdContext);
  const { gpt } = useContext(GptContext);
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
  const [loading, setLoading] = useStateSync(false);
  const [controller, setController] = useState<AbortController>(); //中断请求
  const [questionText, setQuestionText] = useStateSync("");
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

  useEffect(() => {
    if (questioningMode) {
      if (current.id && current.id != -1) {
        localStorage.setItem(
          "questioningMode" + current.id,
          JSON.stringify(questioningMode)
        );
      }
    }
  }, [questioningMode]);

  useEffect(() => {
    if (current.id && current.id != -1) {
      setQuestioningMode(
        JSON.parse(localStorage.getItem("questioningMode" + current.id) || "{}")
      );
    }
  }, [current.id]);
  const send = async () => {
    if (loading) {
      if (controller) {
        controller.abort();
      }
      toast.error("请求已取消");
      setLoading(false);
      return;
    }
    if (questionText == "") {
      toast.error("请输入内容");
      return;
    }
    setLoading(true);
    const newMessage: ChatMessage[] = [
      ...messages,
      {
        data: { role: "user", content: questionText || "" },
        time: new Date().toLocaleString(),
      },
    ];
    await setMessages(newMessage, async (newState) => {
      const controllerValue = new AbortController();
      setController(controllerValue);
      await generateMessage(
        newState,
        gpt,
        questioningMode?.value || "one",
        controllerValue,
        (newMessages) => {
          setMessages(newMessages);
        }
      );
      setLoading(false);
      setQuestionText("");
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
        <NavbarTItleView name={name} count={messages.length} />
        <Navbar.Content css={{ gap: isMobile ? 16 : undefined }}>
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
              <div className={styles.link}>
                {/*<Edit set="light" size={22} />*/}
                <Edit set="curved" size={22} />
              </div>
            </EditName>
          </Navbar.Item>
          <Navbar.Item>
            <MaxTokensLimit
              select={questioningMode}
              updateSelect={(value) => {
                setQuestioningMode(value);
              }}
            >
              <Filter set="curved" size={22} />
            </MaxTokensLimit>
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
              <Delete set="curved" size={22} />
            </SelectView>
          </Navbar.Item>
          {!isMobile && (
            <Navbar.Item>
              <div
                className={styles.link}
                onClick={() => {
                  exportMarkdown({ messages });
                }}
              >
                <Download set="curved" size={22} />
              </div>
            </Navbar.Item>
          )}
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
      <InputView
        questionText={questionText}
        setQuestionText={setQuestionText}
        loading={loading}
        send={send}
      />
    </div>
  );
}
