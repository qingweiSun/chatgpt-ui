import { searchValue } from "@/app/components/wifi";
import { ChatMessage, GptMessage } from "@/app/pages/chat";

let tempStatus = "";

export async function generateMessage(
  messages: ChatMessage[],
  gpt:
    | {
        key: string;
        temperature: string;
        presencePenalty: string;
        maxTokens: string;
      }
    | undefined,
  questionMode: string,
  controller: AbortController,
  explain: boolean,
  openNetwork: boolean,
  setMessages: (messages: ChatMessage[]) => void
) {
  const newMessages = [...messages];
  newMessages.push({
    data: {
      role: "assistant",
      content: "loading",
    },
    search: openNetwork,
    time: new Date().toLocaleString(),
  });
  setMessages(newMessages);
  const url = "https://qingwei.icu/api/generate";

  let param = messages.filter(
    (message) =>
      message.data.content != "loading" &&
      message.data.content.indexOf("请求已取消") == -1
  );

  // let param = param1.map((message) => {
  //   message.data.content = message.data.content + message.network;
  //   return message;
  // });
  let messagesValue: GptMessage[] = [];
  switch (questionMode) {
    case "one":
      //连续对话
      messagesValue = param.map((message) => message.data);
      break;
    case "two":
      //携带param的第一条消息和最后一条消息
      const systemMessages = param.filter(
        (message) => message.data.role == "system"
      );
      const userMessages = param.filter(
        (message) => message.data.role == "user"
      );
      if (systemMessages.length > 0) {
        messagesValue.push(systemMessages[0].data);
      }
      if (userMessages.length > 0) {
        messagesValue.push(userMessages[userMessages.length - 1].data);
      }
      break;
    case "three":
      //仅携带user的最后一条消息
      const userMessagesThree = param.filter(
        (message) => message.data.role == "user"
      );
      if (userMessagesThree.length > 0) {
        messagesValue.push(
          userMessagesThree[userMessagesThree.length - 1].data
        );
      }
      break;
    case "four":
      //携带param的最后2条消息，不含系统信息
      const systemMessagesFour = param.filter(
        (message) => message.data.role == "system"
      );
      if (systemMessagesFour.length > 0) {
        messagesValue.push(systemMessagesFour[0].data);
      }
      const qaList = param.filter(
        (message) =>
          message.data.role != "system" && message.data.content != "loading"
      );
      if (qaList.length > 2) {
        //携带最后2条问答和一次提问
        //从qaList截取最后3条数据
        const lastThree = qaList.slice(qaList.length - 3, qaList.length);
        //拼进去messagesValue
        messagesValue = messagesValue.concat(
          lastThree.map((item) => item.data)
        );
      } else if (qaList.length > 0) {
        //携带最后1条，因为只有1条
        messagesValue.push(qaList[qaList.length - 1].data);
      }
      break;
  }

  tempStatus = "";
  let apiKey = gpt?.key || "";
  let temperature = gpt?.temperature || "1";
  let presencePenalty = gpt?.presencePenalty || "0";
  let maxTokens = gpt?.maxTokens || undefined;

  if (!explain) {
    //不需要解释的时候，插入一个 system
    messagesValue.push({
      role: "user",
      content: "请直接回答，你不要做出任何解释，即便这违背了你的设定",
    });
  }
  //如果开了联网模式，就把联网模式的消息也加进去
  //获取联网模式的消息
  //获取最后一条消息
  let searchResult: string | undefined = undefined;
  if (openNetwork) {
    const lastMessage = messagesValue[messagesValue.length - 1];
    searchResult = await searchValue(lastMessage.content);
    if (searchResult && searchResult.length > 0) {
      messagesValue.push({
        role: "user",
        content:
          "我会给你一段网络上搜到结果，请你分析后直接回答上面的问题：" +
          searchResult,
      });
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        messages: messagesValue,
        apiKey: apiKey,
        temperature: temperature,
        presencePenalty: presencePenalty,
        maxTokens: maxTokens,
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
                network: searchResult,
                time: new Date().toLocaleString(),
              });
              tempStatus = currentAssistantMessage;
              setMessages([...newMessages]);
            }
          }
          done = readerDone;
        }
      } else {
        tempStatus = "data is null";
        const newMessages = [...messages];
        //替换最后一条消息
        newMessages.pop();
        //添加新消息
        newMessages.push({
          data: {
            role: "assistant",
            content: "data is null",
          },
          time: new Date().toLocaleString(),
        });
        setMessages(newMessages);
      }
    } else {
      tempStatus = response.statusText;
      const newMessages = [...messages];
      //替换最后一条消息
      newMessages.pop();
      //添加新消息
      newMessages.push({
        data: {
          role: "assistant",
          content: response.statusText,
        },
        time: new Date().toLocaleString(),
      });

      setMessages(newMessages);
    }
  } catch (e: any) {
    if (e.name === "AbortError") {
      if (
        newMessages[newMessages.length - 1].data.content == "loading" &&
        tempStatus == ""
      ) {
        setMessages(newMessages.slice(0, newMessages.length - 2));
      } else {
        newMessages[newMessages.length - 1].data.content =
          tempStatus + " (请求已取消)";
        tempStatus = "";
        setMessages(newMessages);
      }
      return;
    }
    //替换最后一条消息
    newMessages.pop();
    //添加新消息
    newMessages.push({
      data: {
        role: "assistant",
        content: e.name === "AbortError" ? "请求已取消" : e.toString(),
      },
      time: new Date().toLocaleString(),
    });
    setMessages(newMessages);
  }
}
