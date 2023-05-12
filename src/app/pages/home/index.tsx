import Slider, { HistoryItem } from "@/app/components/slider";
import { db } from "@/app/db/db";
import { context } from "@/app/hooks/context-mobile";
import IdContext from "@/app/hooks/use-chat-id";
import AppContext from "@/app/hooks/use-style";
import ChatView from "@/app/pages/chat";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { Image, notification } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { copyToClipboard } from "../chat/markdown-text";
import NoteView from "../note/note";
import styles from "./home.module.css";

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
//环境变量
//apiKey: process.env.OPENAI_API_KEY
