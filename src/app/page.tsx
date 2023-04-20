"use client";

//https://nextui.org/docs/guide/getting-started ui
// 1. import `NextUIProvider` component
import { createTheme } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import Home from "@/app/pages/home";
import { Toaster, toast } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import MobileProvider from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import IdContext from "@/app/hooks/use-chat-id";
import { ConfigProvider } from "antd";
import GptContext from "./hooks/use-gpt";

const theme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {},
});

export default function Index() {
  const [loading, setLoading] = useState(true);
  const tempCurrent = JSON.stringify({ id: 10000, name: "随便聊聊" });
  const [current, setId] = useState({ id: -1, name: "随便聊聊" });
  const [mode, setMode] = useState<{
    mode: "card" | "normal" | string;
    size?: "small" | "medium" | "large" | string;
  }>({
    mode: "card",
    size: "medium",
  });

  const [gpt, setGpt] = useState<{
    key: string;
    temperature: string;
    presencePenalty: string;
    maxTokens: string;
  }>();

  useEffect(() => {
    setLoading(false);
    setMode(JSON.parse(localStorage.getItem("mode-new") || "{}") || {});
    setGpt(JSON.parse(localStorage.getItem("gpt") || "{}") || {});
    setId(JSON.parse(localStorage.getItem("current") || tempCurrent));
  }, []);

  useEffect(() => {
    if (gpt?.key) {
      localStorage.setItem("gpt", JSON.stringify(gpt));
    }
  }, [gpt]);

  useEffect(() => {
    if (current.id != -1) {
      localStorage.setItem("current", JSON.stringify(current));
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
                borderRadius: 12,
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
          <Analytics />
          {/*https://github.com/timolins/react-hot-toast*/}
          <Toaster />
        </Fragment>
      )}
    </div>
  );
}
