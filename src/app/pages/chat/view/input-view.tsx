import { context } from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import { Button } from "@nextui-org/react";
import { Dropdown, MenuProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useState } from "react";
import { CloseSquare, Send } from "react-iconly";
import styles from "../index.module.css";
import { copyToClipboard } from "../markdown-text";
import { toast } from "react-hot-toast";
import { ChatMessage } from "..";
import { useMediaQuery } from "react-responsive";

export default function InputView(props: {
  questionText: string;
  isDarkMode: boolean;
  setQuestionText: (value: string) => void;
  send: () => void;
  onFocus: () => void;
  loading: boolean;
  placeholder?: string;
}) {
  const { isMobile } = useContext(context);

  return (
    <div className={styles.bottom}>
      <Dropdown
        overlayStyle={{
          border: props.isDarkMode
            ? "1px solid rgba(57, 58, 60, 1)"
            : "1px solid #eeeeee",
          borderRadius: 12,
        }}
        menu={{
          items: [
            {
              label: (
                <ContextMemuItem disabled={props.questionText.trim() == ""}>
                  复制
                </ContextMemuItem>
              ),
              disabled: props.questionText.trim() == "",
              key: "1",
              onClick: () => {
                var selection = window.getSelection()?.toString() ?? "";
                if (selection.trim().length > 0) {
                  copyToClipboard(selection);
                } else {
                  copyToClipboard(props.questionText);
                }
              },
            },
            {
              label: (
                <ContextMemuItem disabled={props.questionText.trim() == ""}>
                  剪切
                </ContextMemuItem>
              ),
              disabled: props.questionText.trim() == "",
              key: "4",
              onClick: () => {
                var selection = window.getSelection()?.toString() ?? "";
                if (selection.length > 0) {
                  copyToClipboard(selection, false);
                  props.setQuestionText(
                    props.questionText.replace(selection, "")
                  );
                } else {
                  copyToClipboard(props.questionText, false);
                  props.setQuestionText("");
                }
              },
            },
            {
              label: "粘贴",

              key: "2",
              onClick: () => {
                navigator.clipboard.readText().then((text) => {
                  var selection = window.getSelection()?.toString() ?? "";
                  console.log(selection);
                  console.log(props.questionText);
                  console.log(props.questionText.replace(selection, "") + text);
                  props.setQuestionText(
                    props.questionText.replace(selection, "") + text
                  );
                });
              },
            },
            {
              type: "divider",
            },
            {
              label: (
                <ContextMemuItem disabled={props.questionText.trim() == ""}>
                  清空
                </ContextMemuItem>
              ),
              disabled: props.questionText.trim() == "",
              key: "3",
              onClick: () => {
                props.setQuestionText("");
              },
            },
            {
              label: (
                <ContextMemuItem
                  disabled={props.questionText.trim() == ""}
                  color="var(--nextui-colors-primary)"
                >
                  保存到随便记记
                </ContextMemuItem>
              ),
              key: "5",
              disabled: props.questionText.trim() == "",
              onClick: () => {
                const temp: ChatMessage[] =
                  JSON.parse(localStorage.getItem("historyList" + 2) || "[]") ||
                  [];
                temp.push({
                  data: {
                    role: "user",
                    content: props.questionText,
                  },
                  time: new Date().toLocaleString(),
                });
                localStorage.setItem("historyList" + 2, JSON.stringify(temp));
                toast.success(" 已保存到随便记记");
              },
            },
          ],
        }}
        trigger={["contextMenu"]}
      >
        <TextArea
          value={props.questionText}
          className={styles.question}
          style={{
            background: "transparent !important",
          }}
          bordered={false}
          autoFocus
          onFocus={props.onFocus}
          placeholder={
            props.placeholder ?? "请输入您想提问的问题（⌥+Return换行）"
          }
          autoSize={{ minRows: isMobile ? 4 : 7, maxRows: 16 }}
          onChange={(e) => {
            props.setQuestionText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.altKey) {
              e.preventDefault();
              // @ts-ignore
              const { selectionStart, selectionEnd, value } = e.target;
              const textBeforeCursor = value.substring(0, selectionStart);
              const textAfterCursor = value.substring(
                selectionEnd,
                value.length
              );
              props.setQuestionText(`${textBeforeCursor}\n${textAfterCursor}`);
              // 将光标移到新行的开头
              // @ts-ignore
              e.target.selectionStart = selectionEnd + 1;
              // @ts-ignore
              e.target.selectionEnd = selectionEnd + 1;
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (!props.loading) {
                props.send();
              }
            }
          }}
        />
      </Dropdown>
      <div style={{ position: "absolute", bottom: 0, right: 0, padding: 10 }}>
        <Button
          auto
          disabled={props.questionText.trim() == "" && !props.loading}
          onPress={props.send}
          color={props.loading ? "error" : "primary"}
          css={{
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 8,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            background: props.loading
              ? undefined
              : props.isDarkMode
              ? props.questionText.trim() == ""
                ? "#1a1a1a !important"
                : undefined
              : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {props.loading ? "停止" : "发送"}
            {props.loading ? (
              <CloseSquare set="curved" size={"small"} />
            ) : (
              <Send set="curved" size={"small"} />
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}

export function ContextMemuItem(props: {
  disabled: boolean;
  color?: string;
  children: React.ReactNode;
}) {
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  return (
    <div
      style={{
        color: props.disabled
          ? isDarkMode
            ? "#444444"
            : undefined
          : props.color ?? undefined,
      }}
    >
      {props.children}
    </div>
  );
}
