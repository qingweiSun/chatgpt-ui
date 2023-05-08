import { Navbar, Tooltip } from "@nextui-org/react";
import { Swap } from "react-iconly";
import { HistoryItem } from "./slider";
import toast from "react-hot-toast";
import { updateSliderOpenNetwork } from "../db/db";

export default function WifiView(props: {
  className: string;
  item: HistoryItem;
}) {
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

export async function searchValue(text: string) {
  const response = await fetch(`/api/wifi?query=${text}`, {
    method: "GET",
  });
  if (response.ok) {
    const data = await response.json();
    return JSON.stringify(data);
  } else {
    return "";
  }
}
