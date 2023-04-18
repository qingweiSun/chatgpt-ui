import ReactMarkdown from "react-markdown";
import RemarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./index.module.css";
import toast from "react-hot-toast";

export default function MarkdownText(props: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkGfm]}
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
                style={oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  backgroundColor: "#f7f7f7",
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

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("复制成功");
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("复制成功");
    } catch (error) {
      toast.error("复制失败");
    }
    document.body.removeChild(textArea);
  }
}
