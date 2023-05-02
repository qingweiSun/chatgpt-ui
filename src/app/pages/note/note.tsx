import { Navbar } from "@nextui-org/react";
import styles from "../chat/index.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { context } from "@/app/hooks/context-mobile";
import { useMediaQuery } from "react-responsive";
import NavbarTItleView from "../chat/view/name-view";
import InputView from "../chat/view/input-view";
import { useScroll } from "@/app/hooks/use-scroll";
import UserView from "../chat/user-chat-view";
import { toast } from "react-hot-toast";
import { exportMarkdown } from "@/app/components/setting";
import { Delete, Download } from "react-iconly";
import { SelectView } from "@/app/components/delete-view";
import { ChatMessage } from "../chat";
import { Empty } from "antd";
export default function NoteView() {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [messages, setMessages] = useState<string[]>(
    JSON.parse(localStorage.getItem("historyList" + 2) || "[]") || []
  );
  const [questionText, setQuestionText] = useState<string>("");
  const scrollRef = useRef(null); //监听滚动
  const { canScroll } = useScroll(scrollRef);

  useEffect(() => {
    localStorage.setItem("historyList" + 2, JSON.stringify(messages));
  }, [messages]);

  return (
    <div className={styles.container}>
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
          <NavbarTItleView name={"随便记记"} count={messages.length} id={2} />
        </Navbar.Brand>
        <Navbar.Content css={{ gap: isMobile ? 16 : undefined }}>
          <Navbar.Item>
            <SelectView
              onDelete={() => {
                setMessages([]);
                toast.success("已删除");
              }}
              title={"提示"}
              description={"确定要删除您的笔记吗？"}
              placement={"bottom-right"}
              className={styles.link}
            >
              <Delete set="curved" size={23} />
            </SelectView>
          </Navbar.Item>
          <Navbar.Item>
            <div
              className={styles.link}
              onClick={() => {
                const tempData: ChatMessage[] = messages.map((e) => {
                  return {
                    data: {
                      role: "user",
                      content: e,
                    },
                    time: new Date().toLocaleString(),
                  };
                });
                exportMarkdown({ messages: tempData });
              }}
            >
              <Download set="curved" size={23} />
            </div>
          </Navbar.Item>
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
          <div style={{ height: "100%", marginTop: "20%" }}>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 160 }}
              description={
                <div style={{ color: isDarkMode ? "#999999" : "#b9b9b9" }}>
                  这里是您的临时笔记寄存处，记得要处理奥
                </div>
              }
            />
          </div>
        )}
        {messages.map((value, index) => {
          return (
            <UserView
              key={value}
              deleteItem={() => {
                const newMessages = [...messages];
                newMessages.splice(index, 1);
                setMessages(newMessages);
              }}
            >
              {{
                data: { role: "user", content: value },
                time: new Date().toLocaleString(),
              }}
            </UserView>
          );
        })}
        <div style={{ height: 150 }} />
        <div id={"home_end"} />
      </div>
      <InputView
        isDarkMode={isDarkMode}
        questionText={questionText ?? ""}
        setQuestionText={setQuestionText}
        loading={false}
        placeholder="请输入您想记下的事情（⌥+Return换行）,支持markdown显示"
        send={() => {
          const newMessages = [...messages];
          newMessages.push(questionText);
          setMessages(newMessages);
          setQuestionText("");
        }}
        onFocus={() => {}}
      />
    </div>
  );
}
