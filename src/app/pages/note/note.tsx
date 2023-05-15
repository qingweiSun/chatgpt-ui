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
import { Bookmark, Delete, Download, MoreSquare } from "react-iconly";
import { SelectView } from "@/app/components/delete-view";
import { ChatMessage } from "../chat";
import { Empty } from "antd";
import BotChatTextView from "../chat/bot-chat-text-view";
import MobileSlider from "@/app/components/slider/mobile";
import stylesNote from "./index.module.css";
export default function NoteView() {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [messages, setMessages] = useState<ChatMessage[]>(
    JSON.parse(localStorage.getItem("historyList" + 2) || "[]") || []
  );
  const [questionText, setQuestionText] = useState<string>("");
  const scrollRef = useRef(null); //监听滚动
  const { canScroll } = useScroll(scrollRef);

  useEffect(() => {
    localStorage.setItem("historyList" + 2, JSON.stringify(messages));
  }, [messages]);

  // useEffect(() => {
  //   document.fonts.load("GB2312").then(() => {
  //     alert("Font loaded");
  //   });
  // }, []);

  return (
    <div className={styles.container}>
      {/* <div
        className={stylesNote.txt}
        style={{
          opacity: isDarkMode ? 0.1 : 0.1,
        }}
      >
        <div>豪情在天,谁能与我争锋。</div>
        <div>青锋在手,谁能一剑屠龙。</div>
        <div>中原逐鹿方,显英雄本色。</div>
        <div>武林风起,自当气吞山河。</div>
        <div>仗剑八万里,横戈天地间。</div>
        <div>侠骨傲群英,江湖任我行。</div>
        <div>绝世有神功,忠义写胸中。</div>
        <div>浩荡英雄气,叱咤武林风。</div>
        <div style={{ width: 20 }} />
        <div>武林风|侯健</div>
      </div> */}
      <div
        style={{
          height: "100%",
          overflowY: "scroll",
          width: "100%",
          overflowX: "hidden",
        }}
      >
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
              : "rgba(243, 243, 243, 0.7) !important",
            borderBottom: `1px solid ${isDarkMode ? "#1c1c1c" : "#ebebeb"}`,
            minHeight: 68,
            height: 68,
          }}
        >
          {!isMobile && (
            <Navbar.Brand data-tauri-drag-region>
              <NavbarTItleView
                name={"随便记记"}
                count={messages.length}
                id={2}
              />
            </Navbar.Brand>
          )}
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
                  exportMarkdown({ messages: messages });
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
                  <div
                    style={{
                      color: isDarkMode ? "#999999" : "#b9b9b9",
                      fontSize: 13,
                      opacity: 0.8,
                    }}
                  >
                    这里是您的临时笔记寄存处，记得要处理奥
                  </div>
                }
              />
            </div>
          )}
          {messages.map((value, index) => {
            return value.data.role == "user" ? (
              <UserView
                key={index}
                id={2}
                deleteItem={() => {
                  const newMessages = [...messages];
                  newMessages.splice(index, 1);
                  setMessages(newMessages);
                }}
                onCompleted={() => {
                  //获取 index 的位置对应的内容，用～～括起来
                  const newMessages = [...messages];
                  if (newMessages[index].data.content.startsWith("~~")) {
                    toast.error("已经是完成状态了");
                    return;
                  }

                  let teampText = (newMessages[index].data.content =
                    newMessages[index].data.content);
                  //teampText是一段 markdown,里面可能有代码块，获取teampText代码块的内容
                  const codeBlocks = teampText.match(/```[\s\S]*?```/g);
                  if (codeBlocks) {
                    console.log(codeBlocks);
                    //将代码块替换为占位符
                    codeBlocks.forEach((item) => {
                      teampText = teampText.replace(item, "~~code~~");
                    });
                    teampText = teampText
                      .split("\n")
                      .map((item) => {
                        console.log(item);
                        if (
                          item.trim().length > 0 &&
                          !item.startsWith("~~") &&
                          !item.endsWith("~~")
                        ) {
                          return "~~" + item.trim() + "~~";
                        } else {
                          return item;
                        }
                      })
                      .join("\n");
                    //讲占位符替换为代码块
                    codeBlocks.forEach((item) => {
                      teampText = teampText.replace("~~code~~", item);
                    });
                    newMessages[index].data.content = teampText;
                  } else {
                    newMessages[index].data.content = newMessages[
                      index
                    ].data.content
                      .split("\n")
                      .map((item) => {
                        console.log(item);
                        if (
                          item.trim().length > 0 &&
                          !item.startsWith("~~") &&
                          !item.endsWith("~~")
                        ) {
                          return "~~" + item.trim() + "~~";
                        } else {
                          return item;
                        }
                      })
                      .join("\n");
                  }
                  setMessages(newMessages);
                }}
                updateItemContent={(content) => {
                  const newMessages = [...messages];
                  newMessages[index].data.content = content;
                  newMessages[index].time = new Date().toLocaleString();
                  setMessages(newMessages);
                }}
              >
                {value}
              </UserView>
            ) : (
              <BotChatTextView
                id={2}
                key={index}
                deleteItem={() => {
                  const newMessages = [...messages];
                  newMessages.splice(index, 1);
                  setMessages(newMessages);
                }}
                onCompleted={() => {
                  //获取 index 的位置对应的内容，用～～括起来
                  const newMessages = [...messages];
                  if (newMessages[index].data.content.startsWith("~~")) {
                    toast.error("已经是完成状态了");
                    return;
                  }
                  let teampText = (newMessages[index].data.content =
                    newMessages[index].data.content);
                  //teampText是一段 markdown,里面可能有代码块，获取teampText代码块的内容
                  const codeBlocks = teampText.match(/```[\s\S]*?```/g);
                  if (codeBlocks) {
                    console.log(codeBlocks);
                    //将代码块替换为占位符
                    codeBlocks.forEach((item) => {
                      teampText = teampText.replace(item, "~~code~~");
                    });
                    teampText = teampText
                      .split("\n")
                      .map((item) => {
                        console.log(item);
                        if (
                          item.trim().length > 0 &&
                          !item.startsWith("~~") &&
                          !item.endsWith("~~")
                        ) {
                          return "~~" + item.trim() + "~~";
                        } else {
                          return item;
                        }
                      })
                      .join("\n");
                    //讲占位符替换为代码块
                    codeBlocks.forEach((item) => {
                      teampText = teampText.replace("~~code~~", item);
                    });
                    newMessages[index].data.content = teampText;
                  } else {
                    newMessages[index].data.content = newMessages[
                      index
                    ].data.content
                      .split("\n")
                      .map((item) => {
                        console.log(item);
                        if (
                          item.trim().length > 0 &&
                          !item.startsWith("~~") &&
                          !item.endsWith("~~")
                        ) {
                          return "~~" + item.trim() + "~~";
                        } else {
                          return item;
                        }
                      })
                      .join("\n");
                  }
                  setMessages(newMessages);
                }}
                updateItemContent={(content) => {
                  const newMessages = [...messages];
                  newMessages[index].data.content = content;
                  newMessages[index].time = new Date().toLocaleString();
                  setMessages(newMessages);
                }}
              >
                {value}
              </BotChatTextView>
            );
          })}
          <div style={{ height: 150 }} />
          <div id={"home_end"} />
        </div>
      </div>
      <InputView
        isDarkMode={isDarkMode}
        questionText={questionText ?? ""}
        setQuestionText={setQuestionText}
        loading={false}
        placeholder="请输入您想记下的事情（⌥+Return换行）,支持markdown显示"
        send={() => {
          const newMessages = [...messages];
          newMessages.push({
            data: {
              role: "user",
              content: questionText,
            },
            time: new Date().toLocaleString(),
          });
          setMessages(newMessages);
          setQuestionText("");
        }}
        onFocus={() => {
          canScroll.current = true;
        }}
      />
    </div>
  );
}
