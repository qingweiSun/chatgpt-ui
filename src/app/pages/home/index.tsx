import Slider, { HistoryItem } from "@/app/components/slider";
import { db } from "@/app/db/db";
import { context } from "@/app/hooks/context-mobile";
import IdContext from "@/app/hooks/use-chat-id";
import AppContext from "@/app/hooks/use-style";
import ChatView from "@/app/pages/chat";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NoteView from "../note/note";
import SettingView from "../setting";
import styles from "./home.module.css";
import { toast } from "react-hot-toast";

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

  const navigate = useNavigate();
  const location = useLocation();
  const recordUseTemp = useLiveQuery(() => {
    if (location.pathname == "/chat") {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      return db.sliders.get(+(id ?? 1));
    } else if (location.pathname == "/note") {
      return {
        id: 2,
        title: "随便记记",
        top: true,
      };
    } else if (location.pathname == "/settings") {
      return {
        id: 2,
        title: "设置",
        top: true,
      };
    }
  }, [location]);

  useEffect(() => {
    db.on("populate", function () {
      db.sliders.put({
        id: 1,
        title: "随便聊聊",
        top: false,
      });
      db.sliders.put({
        id: 10000,
        title: "新的会话10000",
        top: false,
      });
      navigate("/chat?id=10000");
    });
  }, []);

  const [recordUse, setRecordUse] = useState<HistoryItem>();

  useEffect(() => {
    if (recordUseTemp) {
      setRecordUse(recordUseTemp);
    }
  }, [recordUseTemp]);

  useEffect(() => {
    if (location.pathname == "/chat") {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      setId({ id: Number(id) });
    } else if (location.pathname == "/note") {
      setId({ id: 2 });
    } else if (location.pathname == "/settings") {
      setId({ id: 3 });
    } else {
      const tempCurrent = JSON.stringify({ id: 1 });
      const tempId = JSON.parse(localStorage.getItem("current") ?? tempCurrent);
      navigate("/chat?id=" + tempId.id);
    }
  }, [location]);

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
          <Routes>
            <Route path="/settings" element={<SettingView />} />
            <Route path="/note" element={<NoteView />} />
            {recordUse && (
              <Route
                path="/chat"
                element={<ChatView item={recordUse} key={recordUse?.id} />}
              />
            )}
            {!recordUse && (
              <Route
                path="/chat"
                element={
                  <div
                    style={{
                      background: isDarkMode ? "#111111" : "#f3f4f5",
                      height: "100%",
                      flex: 1,
                    }}
                  />
                }
              />
            )}
          </Routes>
        </div>
      </div>
    </>
  );
}
//环境变量
//apiKey: process.env.OPENAI_API_KEY
