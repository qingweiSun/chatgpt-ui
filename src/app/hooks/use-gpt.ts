import { createContext } from "react";

const GptContext = createContext<{
  gpt:
    | {
        key: string;
        password: string;
        temperature: string;
        presencePenalty: string;
        maxTokens: string;
      }
    | undefined;
  setGpt: (gpt: {
    key: string;
    password: string;
    temperature: string;
    presencePenalty: string;
    maxTokens: string;
  }) => void;
}>({
  gpt: {
    key: "",
    password: "",
    temperature: "",
    presencePenalty: "",
    maxTokens: "",
  },
  setGpt: (gpt: {
    key: string;
    password: string;
    temperature: string;
    presencePenalty: string;
    maxTokens: string;
  }) => {},
});

export default GptContext;
