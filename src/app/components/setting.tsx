import React, { useContext } from "react";
import { ChatMessage } from "@/app/pages/chat";
import toast from "react-hot-toast";
import AppContext from "@/app/hooks/use-style";
import { context } from "@/app/hooks/context-mobile";
import ApiKeyModal from "@/app/components/api-key-modal";

export default function SettingModal(props: {
  className?: string;
  children: React.ReactNode;
}) {


  return (
    <ApiKeyModal
      apiKey={"122"}
      maxTokens={100}
      updateMaxTokens={() => {}}
      setApiKey={() => {}}
      temperature={"122"}
      updateTemperature={() => {}}
      presencePenalty={"122"}
      updatePresencePenalty={() => {}}
      showCostType={"tokens"}
      updateShowCostType={() => {}}
    />
  );
}

export function exportMarkdown(props: { messages: ChatMessage[] }) {
  //过滤掉系统消息
  const outputList = props.messages.filter((e) => {
    return e.data.role != "system";
  });
  if (outputList.length > 0) {
    const blob = new Blob(
      [
        props.messages
          .map(
            (m) =>
              `${
                m.data.role == "user"
                  ? `## **${m.data.role}**: `
                  : `**${m.data.role}**:`
              }${m.data.content}`
          )
          .join("\r\n\n"),
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    //获取当前时间戳
    const timestamp = new Date().getTime();
    a.download = `message_${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    toast.success("导出成功，等待浏览器下载");
  } else {
    toast.error("没有数据可以导出");
  }
}
