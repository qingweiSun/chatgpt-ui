import styles from "./index.module.css";
import { Navbar } from "@nextui-org/react";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import UserView from "@/app/pages/chat/user-chat-view";
import { Delete, Download, Edit, Filter, MoreSquare } from "react-iconly";
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
import GptContext from "@/app/hooks/use-gpt";
import MaxTokensLimit, {
  MaxTokensLimitProps,
} from "@/app/components/max-tokens-limit";
import { context } from "@/app/hooks/context-mobile";
import NavbarTItleView from "./view/name-view";
import InputView from "./view/input-view";
import { useLiveQuery } from "dexie-react-hooks";
import { db, updateSliderMode, updateSliderTitle } from "@/app/db/db";
import { HistoryItem } from "@/app/components/slider";

export interface ChatMessage {
  data: GptMessage;
  time?: string;
}

export interface GptMessage {
  role: "system" | "user" | "assistant";
  content: string | "loading";
}

export default function ChatView(props: { item: HistoryItem }) {
  const { isMobile } = useContext(context);

  const [messages, setMessages] = useStateSync<ChatMessage[]>(
    JSON.parse(localStorage.getItem("historyList" + props.item.id) || "[]") ||
      []
  );

  const { gpt } = useContext(GptContext);
  const scrollRef = useRef(null); //监听滚动
  const { canScroll } = useScroll(scrollRef);
  const [loading, setLoading] = useStateSync(false);
  const [controller, setController] = useState<AbortController>(); //中断请求
  const [questionText, setQuestionText] = useStateSync("");
  useEffect(() => {
    if (props.item.id && messages.length > 0) {
      localStorage.setItem(
        "historyList" + props.item.id,
        JSON.stringify(messages)
      );
    }
    if (props.item?.title.startsWith("新的会话")) {
      const tempName =
        messages.find((e) => {
          return e.data.role === "user";
        })?.data.content || "";
      if (tempName != "") updateSliderTitle(props.item.id, tempName);
    }
    if (messages.length == 0 && props.item.id == 1) {
      setMessages([
        {
          data: {
            role: "assistant",
            content:
              "我是AI助手，专门为您提供语言处理和应用解决方案,有什么需要帮助的么。",
          },
        },
      ]);
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
    if (questionText == "") {
      toast.error("请输入内容");
      return;
    }
    setLoading(true);
    canScroll.current = true;
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
      setQuestionText("");
      await generateMessage(
        newState,
        gpt,
        props.item?.mode?.value || "one",
        controllerValue,
        (newMessages) => {
          setMessages(newMessages);
        }
      );
      setLoading(false);
      canScroll.current = true;
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
            <BotChatTextView
              deleteItem={() => {
                const newMessages = [...messages];
                newMessages.splice(index, 1);
                setMessages(newMessages);
              }}
            >
              {message}
            </BotChatTextView>
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
          minHeight: 68,
          height: 68,
        }}
      >
        <Navbar.Brand>
          {props.item?.title && (
            <NavbarTItleView
              name={props.item?.title}
              count={messages.length}
              id={props.item.id}
            />
          )}
        </Navbar.Brand>
        <Navbar.Content css={{ gap: isMobile ? 16 : undefined }}>
          <Navbar.Item>
            <div className={styles.toggle} onClick={() => {}}>
              <MobileSlider>
                <div className={styles.link}>
                  <MoreSquare set="curved" size={23} />
                </div>
              </MobileSlider>
            </div>
          </Navbar.Item>
          {!isMobile && props.item.id != 1 && (
            <Navbar.Item>
              <EditName
                name={props.item?.title}
                setName={(text) => {
                  updateSliderTitle(props.item.id, text);
                }}
              >
                <div className={styles.link}>
                  {/*<Edit set="light" size={23} />*/}
                  <Edit set="curved" size={23} />
                </div>
              </EditName>
            </Navbar.Item>
          )}

          <Navbar.Item>
            <MaxTokensLimit
              isDisabled={false}
              select={props.item?.mode}
              updateSelect={(value) => {
                updateSliderMode(props.item.id, value);
              }}
            >
              <Filter set="curved" size={23} />
            </MaxTokensLimit>
          </Navbar.Item>

          <Navbar.Item>
            <SelectView
              onDelete={() => {
                setMessages([]);
                localStorage.removeItem("historyList" + props.item.id);
                toast.success("已重置");
              }}
              title={"提示"}
              description={"确定要重置此会话吗？"}
              placement={"bottom-right"}
              className={styles.link}
            >
              <Delete set="curved" size={23} />
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
                <Download set="curved" size={23} />
              </div>
            </Navbar.Item>
          )}
        </Navbar.Content>
      </Navbar>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
        ref={scrollRef}
        onWheel={() => {
          if (canScroll.current) {
            canScroll.current = false;
          }
        }}
      >
        <div />
        {messages.length == 0 && (
          <PromptView
            setPrompt={(text) => {
              setMessages([
                {
                  data: {
                    role: "system",
                    content: text,
                  },
                },
              ]);
            }}
          />
        )}
        {MessageViewList}
        <div style={{ height: 150 }} />
        <div id={"home_end"} />
      </div>
      <InputView
        questionText={questionText}
        setQuestionText={setQuestionText}
        loading={loading}
        send={send}
        onFocus={() => {
          canScroll.current = true;
        }}
      />
    </div>
  );
}
