import { createContext } from "react";

const IdContext = createContext({
  current: { id: 0, name: "" },
  setId: (current: { id: number; name: string }) => {},
});

export default IdContext;
