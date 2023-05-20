"use client";

//https://nextui.org/docs/guide/getting-started ui
// 1. import `NextUIProvider` component
import MobileProvider from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import Home from "@/app/pages/home";
import { ConfigProvider } from "antd";
import { Fragment, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { HashRouter } from "react-router-dom";
import GptContext from "./hooks/use-gpt";

export default function Index() {
  const [loading, setLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    if (gpt) {
      localStorage.setItem("gpt", JSON.stringify(gpt));
    }
  }, [gpt]);

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
              <AppContext.Provider value={{ mode, setMode }}>
                <GptContext.Provider value={{ gpt, setGpt }}>
                  <HashRouter>
                    <Home />
                  </HashRouter>
                </GptContext.Provider>
              </AppContext.Provider>
            </MobileProvider>
          </ConfigProvider>
          {/*https://github.com/timolins/react-hot-toast*/}
          <Toaster />
        </Fragment>
      )}
    </div>
  );
}
