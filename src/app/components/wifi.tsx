import { Navbar, Tooltip } from "@nextui-org/react";
import toast from "react-hot-toast";
import { Swap } from "react-iconly";
import { updateSliderOpenNetwork } from "../db/db";
import { GptMessage } from "../pages/chat";
import { HistoryItem } from "./slider";
import { useMediaQuery } from "react-responsive";

export default function WifiView(props: {
  className: string;
  item: HistoryItem;
}) {
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  return (
    <Tooltip
      content={
        <div
          style={{
            padding: 2,
            display: "flex",
            gap: 4,
            flexDirection: "column",
          }}
        >
          <div>{!(props.item.openNetwork ?? false) ? "默认" : "联网模式"}</div>
          {(props.item.openNetwork ?? false) && (
            <div style={{ fontSize: 12, color: "#999999" }}>
              当前模式先搜索互联网上的内容，然后交给 AI
              总结，实际体验，效果较差，不建议开启
            </div>
          )}
        </div>
      }
      placement="bottom"
      hideArrow
      css={{
        width: props.item.openNetwork ?? false ? 200 : "unset",
        border: isDarkMode ? "1px solid #393a3c" : "1px solid #e9e9e9",
      }}
    >
      <Navbar.Item>
        <a
          className={props.className}
          onClick={() => {
            if (!(props.item.openNetwork ?? false)) {
              toast.success("已开启联网模式");
            } else {
              toast.success("已恢复系统设定");
            }
            updateSliderOpenNetwork(
              props.item.id,
              !(props.item.openNetwork ?? false)
            );
          }}
        >
          {!(props.item.openNetwork ?? false) ? (
            <Swap set="curved" size={23} />
          ) : (
            <Swap
              size={23}
              primaryColor="var(--nextui-colors-primary)"
              set="bold"
            />
          )}
        </a>
      </Navbar.Item>
    </Tooltip>
  );
}
//不可用
export async function searchValue(messagesValue: GptMessage[]) {
  const text = await getSearchKeywoard(messagesValue);
  return text + "搜索结果";
}

export async function getSearchKeywoard(messagesValue: GptMessage[]) {
  //TODO 搜索不可用，请自行替换此处代码
  return "关键词";
}
