import ReactMarkdown from "react-markdown";
import RemarkGfm from "remark-gfm";
import styles from "./index.module.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownText(props: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(
            className ?? "language-javascript"
          );
          return !inline && match ? (
            <div
              style={{ position: "relative", fontSize: 13 }}
              className={styles.code}
            >
              <SyntaxHighlighter
                // @ts-ignore
                style={oneLight}
                language={match[1]}
                PreTag="div"
                showLineNumbers
                showInlineLineNumbers
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              {/*<div*/}
              {/*  style={{*/}
              {/*    position: 'absolute',*/}
              {/*    right: 0,*/}
              {/*    top: 0,*/}
              {/*    padding: 12,*/}
              {/*    background: '#fafafa',*/}
              {/*  }}*/}
              {/*  className={'copy-code'}*/}
              {/*>*/}
              {/*  /!*复制*!/*/}
              {/*</div>*/}
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
