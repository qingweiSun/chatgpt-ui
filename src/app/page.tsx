"use client";

//https://nextui.org/docs/guide/getting-started ui
// 1. import `NextUIProvider` component
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Home from "@/app/pages/home";
import IdContext from "@/app/hooks/use-chat-id";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  type: "light", // it could be "light" or "dark"
  theme: {},
});

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const [current, setId] = useState({ id: -1 });

  return (
    <div>
      {loading ? (
        <div />
      ) : (
        <NextUIProvider theme={theme}>
          <IdContext.Provider value={{ current, setId }}>
            <Home />
            {/*https://github.com/timolins/react-hot-toast*/}
            <Toaster />
          </IdContext.Provider>
        </NextUIProvider>
      )}
    </div>
  );
}
