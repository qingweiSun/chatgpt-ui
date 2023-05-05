import Slider, { HistoryItem } from "@/app/components/slider";
import styles from "./home.module.css";
import ChatView from "@/app/pages/chat";
import { useContext, useEffect, useState } from "react";
import { context } from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import IdContext from "@/app/hooks/use-chat-id";
import { toast } from "react-hot-toast";
import { db } from "@/app/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import NoteView from "../note/note";

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
          {recordUse && current.id != 2 && (
            <ChatView key={recordUse.id} item={recordUse} />
          )}
          {recordUse && current.id == 2 && <NoteView key={2} />}
          {!recordUse && (
            <div
              style={{
                background: "#f7f7f7",
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
