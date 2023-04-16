import { createContext } from "react";

const IdContext = createContext({
  current: { id: 0 },
  setId: (current: { id: number }) => {},
});

export default IdContext;
