import React from "react";

const AppContext = React.createContext<{
  mode: {
    mode: "card" | "normal" | string;
    size?: "small" | "medium" | "large" | string;
  };
  setMode: (mode: {
    mode: "card" | "normal" | string;
    size?: "small" | "medium" | "large" | string;
  }) => void;
}>({
  mode: {
    mode: "normal",
    size: "medium",
  },
  setMode: (mode: {
    mode: "card" | "normal" | string;
    size?: "small" | "medium" | "large" | string;
  }) => {},
});

export default AppContext;
