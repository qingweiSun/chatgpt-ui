"use client";

//https://nextui.org/docs/guide/getting-started ui
// 1. import `NextUIProvider` component
import MobileProvider from "@/app/hooks/context-mobile";
import IdContext from "@/app/hooks/use-chat-id";
import AppContext from "@/app/hooks/use-style";
import Home from "@/app/pages/home";
import { createTheme } from "@nextui-org/react";
import { Analytics } from "@vercel/analytics/react";
import { ConfigProvider } from "antd";
import { Fragment, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { HistoryItem } from "./components/slider";
import { db } from "./db/db";
import GptContext from "./hooks/use-gpt";

const theme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {},
});

export default function Index() {
  const [loading, setLoading] = useState(true);
  const tempCurrent = JSON.stringify({ id: 1 });
  const [current, setId] = useState({ id: -1 });
  const [mode, setMode] = useState<{
    mode: "card" | "normal" | string;
    size?: "small" | "medium" | "large" | string;
  }>({
    mode: "card",
    size: "medium",
  });

  const [gpt, setGpt] = useState<{
    key: string;
    password: string;
    temperature: string;
    presencePenalty: string;
    maxTokens: string;
  }>();

  useEffect(() => {
    setLoading(false);
    setMode(JSON.parse(localStorage.getItem("mode-new") ?? "{}") ?? {});
    setGpt(JSON.parse(localStorage.getItem("gpt") ?? "{}") ?? {});
    //获取地址栏参数
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    if (id) {
      const historyList = JSON.parse(
        localStorage.getItem("historyList") || "[]"
      );
      if (historyList && historyList.length > 0) {
        let hasId = false;
        historyList.forEach((item: HistoryItem) => {
          if (item.id == +id) {
            setId({ id: item.id });
            hasId = true;
            return;
          }
        });
        if (!hasId) {
          setId(JSON.parse(localStorage.getItem("current") ?? tempCurrent));
        }
      } else {
        setId(JSON.parse(localStorage.getItem("current") ?? tempCurrent));
      }
    } else {
      setId(JSON.parse(localStorage.getItem("current") ?? tempCurrent));
    }
  }, []);

  useEffect(() => {
    db.on("populate", function () {
      db.sliders.put({
        id: 1,
        title: "随便聊聊",
        top: false,
      });
      db.sliders.put({
        id: 1000,
        title: "新的会话1000",
        top: false,
      });
      setId({ id: 1 });
    });
  }, []);

  useEffect(() => {
    if (gpt) {
      localStorage.setItem("gpt", JSON.stringify(gpt));
    }
  }, [gpt]);

  useEffect(() => {
    if (current.id != -1) {
      localStorage.setItem("current", JSON.stringify(current));
      window.history.replaceState(null, "", "/?id=" + current.id);
    }
  }, [current]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {loading ? (
        <div />
      ) : (
        <Fragment>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 10,
              },
            }}
          >
            <MobileProvider>
              <IdContext.Provider value={{ current, setId }}>
                <AppContext.Provider value={{ mode, setMode }}>
                  <GptContext.Provider value={{ gpt, setGpt }}>
                    <Home />
                  </GptContext.Provider>
                </AppContext.Provider>
              </IdContext.Provider>
            </MobileProvider>
          </ConfigProvider>
          {/* <Analytics /> */}
          {/*https://github.com/timolins/react-hot-toast*/}
          <Toaster />
        </Fragment>
      )}
    </div>
  );
}
