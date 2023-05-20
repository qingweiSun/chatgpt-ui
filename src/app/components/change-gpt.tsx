import { Dropdown, Navbar, Tooltip } from "@nextui-org/react";
import { HistoryItem } from "./slider";
import { useMediaQuery } from "react-responsive";
import toast from "react-hot-toast";
import { TwoUsers, User } from "react-iconly";
import { updateSliderModel } from "../db/db";
import { Segmented } from "antd";
import { useContext } from "react";
import { context } from "../hooks/context-mobile";

export default function ChangeGpt(props: {
  className: string;
  item: HistoryItem;
}) {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({
    query: "(prefers-color-scheme: dark)",
  });
  //"gpt-3.5-turbo" | "gpt-4"
  const data = [
    {
      value: "gpt-3.5-turbo",
      tip: "速度快，价格便宜,推荐使用",
    },
    {
      value: "gpt-4",
      tip: "更智能，但是速度慢，价格也更贵",
    },
  ];
  return (
    <Navbar.Item>
      <Dropdown placement="bottom-right" isBordered>
        <Dropdown.Button
          flat
          size={isMobile ? "sm" : "md"}
          css={{
            padding: "0 16px",
            background: isDarkMode
              ? "#16181a"
              : "var(--nextui-colors-accents1)",
            color: isDarkMode ? "#cccccc" : "#444444",
            "&:hover": {
              color: "var(--nextui-colors-primary)",
              // background: "#b7d5f8",
            },
          }}
        >
          <div style={{ fontSize: 13 }}>
            {isMobile ? "模型" : props.item?.model ?? data[0].value}
          </div>
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Single selection actions"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={[props.item?.model || data[0].value]}
          onSelectionChange={(value) => {
            //@ts-ignore
            const key = value.currentKey;
            const select = data.find((item) => item.value == key);
            if (select) {
              //@ts-ignore
              updateSliderModel(props.item.id, select.value);
            }
          }}
        >
          {data.map((item) => {
            return (
              <Dropdown.Item
                key={item.value}
                css={{
                  height: "auto",
                  color: isDarkMode ? "#cccccc" : undefined,
                }}
              >
                <div
                  style={{
                    padding: "4px 0",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {item.value}
                  <div style={{ color: "#999999", fontSize: 11 }}>
                    {item.tip}
                  </div>
                </div>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </Navbar.Item>
  );
}
