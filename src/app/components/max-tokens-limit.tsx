import { Dropdown } from "@nextui-org/react";
import { ReactNode, useContext, useState } from "react";
import { context } from "../hooks/context-mobile";

export interface MaxTokensLimitProps {
  value: string;
  desc: string;
  tip?: string;
}
export default function MaxTokensLimit(props: {
  select?: MaxTokensLimitProps;
  updateSelect: (select: MaxTokensLimitProps) => void;
  children: ReactNode;
}) {
  const { isMobile } = useContext(context);

  const data = [
    {
      value: "one",
      desc: "连续对话",
      tip: "可以完整理解上下文，但会过度消耗key",
    },
    {
      value: "two",
      desc: "仅角色设定",
      tip: "不理解上下文，但会带上角色属性",
    },
    { value: "three", desc: "仅提问", tip: "完全不理解上下文，只回答问题" },
  ];
  return (
    <Dropdown>
      <Dropdown.Button flat size={isMobile ? "sm" : "md"}>
        <div style={{ fontSize: 13 }}>{props.select?.desc ?? "连续对话"}</div>
      </Dropdown.Button>
      <Dropdown.Menu
        aria-label="Single selection actions"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[props.select?.value || data[0].value]}
        onSelectionChange={(value) => {
          //@ts-ignore
          const key = value.currentKey;
          const select = data.find((item) => item.value == key);
          if (select) {
            props.updateSelect(select);
          }
        }}
      >
        {data.map((item) => {
          return (
            <Dropdown.Item key={item.value} description={item.tip}>
              {item.desc}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
