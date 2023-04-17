import React from "react";

const AppContext = React.createContext<{
  mode: "card" | "normal";
  setMode: (mode: "card" | "normal") => void;
}>({
  mode: "normal",
  setMode: (mode: "normal" | "card") => {},
});

export default AppContext;
