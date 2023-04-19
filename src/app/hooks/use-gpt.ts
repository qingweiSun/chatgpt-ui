import { createContext } from "react";

const GptContext = createContext<{
  gpt:
    | {
        key: string;
        temperature: string;
        presencePenalty: string;
        maxTokens: string;
      }
    | undefined;
  setGpt: (gpt: {
    key: string;
    temperature: string;
    presencePenalty: string;
    maxTokens: string;
  }) => void;
}>({
  gpt: { key: "", temperature: "", presencePenalty: "", maxTokens: "" },
  setGpt: (gpt: {
    key: string;
    temperature: string;
    presencePenalty: string;
    maxTokens: string;
  }) => {},
});

export default GptContext;
