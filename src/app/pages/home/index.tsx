import Slider from "@/app/components/slider";
import { db, isExist } from "@/app/db/db";
import { context } from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import ChatView from "@/app/pages/chat";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NoteView from "../note/note";
import SettingView from "../setting";
import styles from "./home.module.css";

export default function Home() {
  const { isMobile } = useContext(context);
  const { mode, setMode } = useContext(AppContext);
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
  const recordUse = useLiveQuery(() => {
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
        updateTime: new Date().getTime(),
      });
      navigate("/chat?id=10000");
    });
  }, []);

  async function openDefault(id: string | null) {
    //数据库中没有这个id
    if (id && !(await isExist(+id))) {
      navigate("/chat?id=1");
    }
  }

  useEffect(() => {
    if (location.pathname == "/") {
      const tempPath = localStorage.getItem("current_path") ?? "/chat?id=1";
      navigate(tempPath);
    } else if (location.pathname == "/chat" || location.pathname == "/note") {
      localStorage.setItem("current_path", location.pathname + location.search);
      if (location.pathname == "/chat") {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");
        openDefault(id);
      }
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
            <Route path="/settings" element={<SettingView key={3} />} />
            <Route path="/note" element={<NoteView key={2} />} />
            {recordUse && (
              <Route
                path="/chat"
                element={<ChatView item={recordUse} key={recordUse?.id} />}
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
