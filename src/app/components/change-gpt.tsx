import { Navbar, Tooltip } from "@nextui-org/react";
import { HistoryItem } from "./slider";
import { useMediaQuery } from "react-responsive";
import toast from "react-hot-toast";
import { TwoUsers, User } from "react-iconly";
import { updateSliderModel } from "../db/db";

export default function ChangeGpt(props: {
  className: string;
  item: HistoryItem;
}) {
  const isDarkMode = useMediaQuery({
    query: "(prefers-color-scheme: dark)",
  });

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
          <div>
            {(props.item.model ?? "gpt-3.5-turbo") == "gpt-4"
              ? "gpt4"
              : "gpt3.5"}
          </div>
          {(props.item.model ?? "gpt-3.5-turbo") == "gpt-4" && (
            <div style={{ fontSize: 12, color: "#999999" }}>
              更加智能，但是速度较慢，也更加耗费tokens,请酌情使用
            </div>
          )}
          {(props.item.model ?? "gpt-3.5-turbo") == "gpt-3.5-turbo" && (
            <div style={{ fontSize: 12, color: "#999999" }}>
              速度较快，tokens消耗也较少，虽然不如gpt4智能，但是也足够用了
            </div>
          )}
        </div>
      }
      placement="bottom"
      hideArrow
      css={{
        width: 200,
        border: isDarkMode ? "1px solid #393a3c" : "1px solid #e9e9e9",
      }}
    >
      <Navbar.Item>
        <a
          className={props.className}
          onClick={() => {
            //切换模型
            if ((props.item.model ?? "gpt-3.5-turbo") == "gpt-3.5-turbo") {
              updateSliderModel(props.item.id, "gpt-4");
              toast.success("已切换至 gpt4");
            } else {
              updateSliderModel(props.item.id, "gpt-3.5-turbo");
              toast.success("已切换至 gpt3.5");
            }
          }}
        >
          {(props.item.model ?? "gpt-3.5-turbo") == "gpt-3.5-turbo" ? (
            <User set="curved" size={23} />
          ) : (
            <TwoUsers
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
