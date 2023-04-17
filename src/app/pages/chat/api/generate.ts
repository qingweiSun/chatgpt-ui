import {ChatMessage} from "@/app/pages/chat";

let tempStatus = "";

export async function generateMessage(
    messages: ChatMessage[],
    controller: AbortController,
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
    // const url =
    //     process.env.NODE_ENV === "production" ? "/api/chat" : "/api/hello";
    const url = "/api/chat";
    let param = messages.filter(
        (message) =>
            message.data.content != "loading" &&
            message.data.content.indexOf("请求已取消") == -1
    );
    tempStatus = "";

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                messages: param.map((message) => message.data),
                apiKey: undefined
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
                    const {value, done: readerDone} = await reader.read();
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
                newMessages[newMessages.length - 1].data.content == "正在生成中..." &&
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
