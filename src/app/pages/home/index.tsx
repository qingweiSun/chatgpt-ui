import Slider, { HistoryItem } from "@/app/components/slider";
import { db } from "@/app/db/db";
import { context } from "@/app/hooks/context-mobile";
import IdContext from "@/app/hooks/use-chat-id";
import AppContext from "@/app/hooks/use-style";
import ChatView from "@/app/pages/chat";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { Typography, notification } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import NoteView from "../note/note";
import styles from "./home.module.css";

const { Paragraph } = Typography;
export default function Home() {
  const { isMobile } = useContext(context);
  const { mode, setMode } = useContext(AppContext);
  const { current, setId } = useContext(IdContext);
  const cardStyle = () => {
    switch (mode.size) {
      case "small":
        return styles.cardModeSmall;
      case "middle":
        return styles.cardModeMedium;
      case "large":
        return styles.cardModeLarge;
      default:
        return styles.cardModeMedium;
    }
  };

  const recordTempDb = useLiveQuery(() => {
    return db.sliders.get(current.id);
  }, [current]);

  const [recordUse, setRecordUse] = useState<HistoryItem>();

  useEffect(() => {
    if (recordTempDb) {
      setRecordUse(recordTempDb);
    } else if (current.id == 2) {
      setRecordUse({ id: 2, title: "随便记记", top: true });
    }
  }, [recordTempDb]);

  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  const darkTheme = createTheme({
    type: "dark",
  });

  const lightTheme = createTheme({
    type: "light",
  });

  const [isElectron, setIsElectron] = useState(
    typeof navigator !== "undefined" &&
      navigator.userAgent.indexOf("Electron") !== -1
  );
  useEffect(() => {
    if (!isElectron) {
      //每天触发一次
      const lastShowTime = localStorage.getItem("show_notification_time") ?? "";
      const now = new Date().toLocaleDateString();
      if (lastShowTime != now) {
        localStorage.setItem("show_notification_time", now);
        notification.info({
          message: "需要自建吗？",
          duration: 0,
          description: (
            <div>
              随着本站用户量的增长，成本也在逐渐增高，如果你需要更好的体验，我可以帮你自建，12美元/月的消费就可以支持到几十个人使用(这
              12
              美元不是给我的)，均摊下来也很便宜，你可以给别人付费使用，如果你有意向请加微信：
              <Paragraph copyable>18300240232</Paragraph>
            </div>
          ),
        });
      }
    }
  }, []);
  return (
    <>
      <NextUIProvider theme={isDarkMode ? darkTheme : lightTheme} />
      <div
        className={`${styles.container} ${
          mode.mode != "normal" && !isMobile ? cardStyle() : undefined
        }`}
      >
        <div
          className={`${styles.home} ${
            mode.mode != "normal" && !isMobile
              ? styles.cardModeContent
              : undefined
          }`}
        >
          {!isMobile && (
            <div className={styles.slider}>
              <Slider />
            </div>
          )}
          <div className={styles.line} />
          {recordUse && recordUse.id != 2 && (
            <ChatView key={recordUse.id} item={recordUse} />
          )}
          {recordUse && recordUse.id == 2 && <NoteView key={recordUse.id} />}
          {!recordUse && (
            <div
              style={{
                background: isDarkMode ? "#111111" : "#f7f7f7",
                height: "100%",
                flex: 1,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
