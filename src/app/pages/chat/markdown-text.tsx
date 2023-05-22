import ReactMarkdown from "react-markdown";
import RemarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./index.module.css";

import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import React from "react";
function MarkdownTextItem(props: { children: string }) {
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...prop }) {
          const match = /language-(\w+)/.exec(
            className ?? "language-javascript"
          );
          return !inline && match ? (
            <div
              style={{ position: "relative", fontSize: 13, margin: 0 }}
              className={"md-code"}
            >
              <SyntaxHighlighter
                // @ts-ignore
                style={isDarkMode ? oneDark : oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  backgroundColor: isDarkMode ? "#161616" : "#f7f7f7",
                }}
                language={match[1]}
                PreTag="div"
                showLineNumbers
                showInlineLineNumbers
                {...prop}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <div
                className={styles["chat-md-top-action"]}
                onClick={() => copyToClipboard(String(children))}
              >
                复制
              </div>
            </div>
          ) : (
            <code className={className} {...props} style={{ fontWeight: 600 }}>
              {children}
            </code>
          );
        },
      }}
    >
      {props.children.replaceAll("\n", "  \n")}
    </ReactMarkdown>
  );
}

export async function copyToClipboard(text: string, isToast?: boolean) {
  try {
    await navigator.clipboard.writeText(text);
    if (isToast != false) {
      toast.success("复制成功");
    }
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      if (isToast != false) {
        toast.success("复制成功");
      }
    } catch (error) {
      if (isToast != false) {
        toast.success("复制成功");
      }
    }
    document.body.removeChild(textArea);
  }
}
// eslint-disable-next-line react/display-name
const MarkdownText = React.memo((props: { children: string }) => {
  return <MarkdownTextItem>{props.children}</MarkdownTextItem>;
});

export default MarkdownText;
