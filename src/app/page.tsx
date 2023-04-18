"use client";

//https://nextui.org/docs/guide/getting-started ui
// 1. import `NextUIProvider` component
import { createTheme } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import Home from "@/app/pages/home";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import MobileProvider from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import IdContext from "@/app/hooks/use-chat-id";
import { ConfigProvider } from "antd";

const theme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {},
});

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setMode(JSON.parse(localStorage.getItem("mode-new") || "{}") || {});
  }, []);

  const [current, setId] = useState({ id: -1, name: "" });
  const [mode, setMode] = useState<{
    mode: "card" | "normal" | string;
    size?: "small" | "medium" | "large" | string;
  }>({
    mode: "card",
    size: "medium",
  });

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
                  <Home />
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
