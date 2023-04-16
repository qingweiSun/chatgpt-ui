import { ChatMessage } from "@/app/pages/chat";

export async function generateMessage(
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[]) => void
) {
  const newMessages = [...messages];
  newMessages.push({
    data: {
      role: "assistant",
      content: "loading",
    },
    time: new Date().toLocaleString(),
  });
  setMessages(newMessages);
  const controller = new AbortController();
  const response = await fetch("/api/hello", {
    method: "POST",
    body: JSON.stringify({
      messages: messages.map((message) => message.data),
      apiKey: undefined,
      temperature: "0.6",
      presencePenalty: 0,
      maxTokens: undefined,
    }),
    signal: controller.signal,
  });

  if (response.ok) {
    const data = response.body;
    if (data) {
      const reader = data.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let currentAssistantMessage = "";
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) {
          let char = decoder.decode(value);
          if (char === "\n" && currentAssistantMessage.endsWith("\n")) {
            continue;
          }
          if (char) {
            currentAssistantMessage = currentAssistantMessage + char;
            //替换最后一条消息
            newMessages.pop();
            //添加新消息
            newMessages.push({
              data: {
                role: "assistant",
                content: currentAssistantMessage,
              },
              time: new Date().toLocaleString(),
            });
            setMessages([...newMessages]);
          }
        }
        done = readerDone;
      }
    }
  }
}
