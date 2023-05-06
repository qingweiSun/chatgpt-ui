import { SelectView } from "@/app/components/delete-view";
import EditName from "@/app/components/edit-name";
import MaxTokensLimit from "@/app/components/max-tokens-limit";
import PromptView from "@/app/components/prompt-view";
import { exportMarkdown } from "@/app/components/setting";
import { HistoryItem } from "@/app/components/slider";
import MobileSlider from "@/app/components/slider/mobile";
import {
  updateSliderExplain,
  updateSliderMode,
  updateSliderTitle,
} from "@/app/db/db";
import { context } from "@/app/hooks/context-mobile";
import GptContext from "@/app/hooks/use-gpt";
import { useScroll } from "@/app/hooks/use-scroll";
import useStateSync from "@/app/hooks/use-state-with-call";
import { generateMessage } from "@/app/pages/chat/api/generate";
import BotChatTextView from "@/app/pages/chat/bot-chat-text-view";
import UserView from "@/app/pages/chat/user-chat-view";
import { Navbar, Tooltip } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Delete,
  Download,
  Edit,
  Filter,
  Lock,
  MoreSquare,
  Unlock,
} from "react-iconly";
import { useMediaQuery } from "react-responsive";
import styles from "./index.module.css";
import InputView from "./view/input-view";
import NavbarTItleView from "./view/name-view";
import IdContext from "@/app/hooks/use-chat-id";

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
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

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
    localStorage.setItem(
      "historyList" + props.item.id,
      JSON.stringify(messages)
    );
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
        props.item.explain ?? true,
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
            <UserView
              id={props.item.id}
              deleteItem={() => {
                const newMessages = [...messages];
                newMessages.splice(index, 1);
                setMessages(newMessages);
              }}
            >
              {message}
            </UserView>
          ) : (
            <BotChatTextView
              id={props.item.id}
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
      <div style={{ height: "100%", overflowY: "scroll", width: "100%" }}>
        <Navbar
          className={styles.navbar}
          variant="sticky"
          maxWidth={"fluid"}
          disableShadow
          onDoubleClick={() => {
            try {
              // 发送放大窗口的消息给主进程
              const electron = window.require("electron");
              electron.ipcRenderer.send("maximize-window");
            } catch (e) {}
          }}
          containerCss={{
            backgroundColor: isDarkMode
              ? "rgba(17, 17, 17, 0.8) !important"
              : "rgba(247, 247, 247, 0.7) !important",
            borderBottom: `1px solid ${isDarkMode ? "#1a1a1a" : "#eeeeee"}`,
            boxShadow: "0 2px 4px rgb(0 0 0 / 1%)",
            minHeight: 68,
            height: 68,
          }}
        >
          <Navbar.Brand data-tauri-drag-region>
            {props.item?.title && (
              <NavbarTItleView
                name={props.item?.title}
                count={messages.length}
                id={props.item.id}
              />
            )}
          </Navbar.Brand>
          <Navbar.Content>
            {isMobile && (
              <Navbar.Item>
                <div className={styles.toggle} onClick={() => {}}>
                  <MobileSlider>
                    <div className={styles.link}>
                      <MoreSquare set="curved" size={23} />
                    </div>
                  </MobileSlider>
                </div>
              </Navbar.Item>
            )}
            {!isMobile && props.item.id != 1 && (
              <Navbar.Item>
                <EditName
                  className={styles.link}
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
            <Tooltip
              content={
                <div
                  style={{
                    padding: 2,
                    display: "flex",
                    gap: 4,
                    flexDirection: "column",
                  }}
                >
                  <div>{props.item.explain ?? true ? "默认" : "简洁模式"}</div>
                  {!(props.item.explain ?? true) && (
                    <div style={{ fontSize: 12, color: "#999999" }}>
                      当前模式会强行修改系统设定，使得答案会更简练并且节省
                      tokens，但是可能会导致答案不够优质，如果您需要更好的的答案，请点击恢复系统设定。
                    </div>
                  )}
                </div>
              }
              placement="bottom"
              hideArrow
              css={{
                width: !(props.item.explain ?? true) ? 200 : "unset",
              }}
            >
              <Navbar.Item>
                <a
                  className={styles.link}
                  onClick={() => {
                    if (props.item.explain ?? true) {
                      toast.success("已开启简洁模式");
                    } else {
                      toast.success("已恢复系统设定");
                    }
                    updateSliderExplain(
                      props.item.id,
                      !(props.item.explain ?? true)
                    );
                  }}
                >
                  {props.item.explain ?? true ? (
                    <Unlock set="curved" size={23} />
                  ) : (
                    <Lock
                      size={23}
                      primaryColor="var(--nextui-colors-error)"
                      set="bold"
                    />
                  )}
                </a>
              </Navbar.Item>
            </Tooltip>
            {/* <TemplateView /> */}
            <Navbar.Item>
              <SelectView
                onDelete={() => {
                  //获取系统消息
                  const systemMessage = messages.filter(
                    (item) => item.data.role == "system"
                  );
                  setMessages([...systemMessage]);
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
      </div>
      <InputView
        isDarkMode={isDarkMode}
        questionText={questionText ?? ""}
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
