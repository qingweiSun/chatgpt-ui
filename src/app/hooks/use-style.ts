import React from "react";

const AppContext = React.createContext<{
  mode: "card" | "normal"|string;
  setMode: (mode: "card" | "normal"|string) => void;
}>({
  mode: "normal",
  setMode: (mode: "normal" | "card"|string) => {},
});

export default AppContext;
