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
  setMessages: (messages: ChatMessage[]) => void,
  model?: string
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
    case "five":
      // 获取当前时间的时间戳
      var now = new Date().getTime();
      //携带 5分钟内的消息
      const fiveList = param.filter((message) => {
        if (message.time) {
          // 将字符串格式转换为时间戳
          var timestamp = Date.parse(message.time);
          if (now - timestamp <= 5 * 60 * 1000) {
            return message.data.role != "system";
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      //获取系统消息
      const systemMessagesFive = param.filter(
        (message) => message.data.role == "system"
      );
      if (systemMessagesFive.length > 0) {
        messagesValue.push(systemMessagesFive[0].data);
      }
      messagesValue = messagesValue.concat(fiveList.map((item) => item.data));
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
    const temp = [...messagesValue];
    temp.push({
      role: "user",
      content: "请根据以上内容返回一个适合的搜索语句",
    });
    searchResult = await searchValue(temp);
    if (searchResult && searchResult.length > 0) {
      messagesValue.push({
        role: "user",
        content:
          `请总结下面的搜索结果内容以及你本身对问题的思考，回复上面的问题，如果搜索结果没有合适的答案，请结合自身知识回复.

搜索结果为:` +
          JSON.parse(searchResult)
            .map((e: { body: string }, index: number) => {
              return index + 1 + ":" + e.body;
            })
            .join(";"),
      });
    }
  }
  //TODO如果只想部署这一个项目，直接把 url 改为 /api/chat，但是需要部署在可访问 openai api 的服务器上
  //如果搭配后端使用，可以把 url 改为 自己的后端接口，这样需要部署两个项目
  try {
    const url = "/api/chat";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model ?? "gpt-3.5-turbo",
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
