import { Dropdown, NextUIProvider, createTheme } from "@nextui-org/react";
import { ReactNode, useContext, useState } from "react";
import { context } from "../hooks/context-mobile";
import { useMediaQuery } from "react-responsive";

export interface MaxTokensLimitProps {
  value: string;
  desc: string;
  tip?: string;
}
export default function MaxTokensLimit(props: {
  select?: MaxTokensLimitProps;
  updateSelect: (select: MaxTokensLimitProps) => void;
  isDisabled?: boolean;
  children: ReactNode;
}) {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  const data = [
    {
      value: "one",
      desc: "连续对话",
      tip: "完整理解上下文",
    },
    {
      value: "two",
      desc: "仅角色设定",
      tip: "不理解上下文，但会带上角色属性",
    },
    // { value: "three", desc: "仅提问", tip: "完全不理解上下文，只回答问题" },
    {
      value: "four",
      desc: "携带上次问答",
      tip: "携带角色属性，理解最近上下文，便于二次提问",
    },
  ];
  return (
    <Dropdown placement="bottom-right" isBordered isDisabled={props.isDisabled}>
      <Dropdown.Button
        flat
        size={isMobile ? "sm" : "md"}
        isDisabled={props.isDisabled}
        css={{
          background: isDarkMode ? "#1b1b1b" : "var(--nextui-colors-accents1)",
          color: isDarkMode ? "#cccccc" : "#444444",
          "&:hover": {
            color: "var(--nextui-colors-primary)",
            // background: "#b7d5f8",
          },
        }}
      >
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
            <Dropdown.Item
              key={item.value}
              css={{
                height: "auto",
                color: isDarkMode ? "#cccccc" : undefined,
              }}
            >
              <div
                style={{
                  padding: 8,
                  gap: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {item.desc}
                <div style={{ color: "#999999", fontSize: 11 }}>{item.tip}</div>
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
