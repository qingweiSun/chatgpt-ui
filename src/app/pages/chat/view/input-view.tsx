import TextArea from "antd/es/input/TextArea";
import styles from "../index.module.css";
import { Button } from "@nextui-org/react";
import { CloseSquare, Send } from "react-iconly";

export default function InputView(props: {
  questionText: string;
  setQuestionText: (value: string) => void;
  send: () => void;
  loading: boolean;
}) {
  return (
    <div className={styles.bottom}>
      <TextArea
        value={props.questionText}
        className={styles.question}
        bordered={false}
        placeholder="请输入您想提问的问题（⌥+Return换行）"
        autoSize={{ minRows: 6, maxRows: 10 }}
        style={{
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        onChange={(e) => {
          props.setQuestionText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.altKey) {
            e.preventDefault();
            // @ts-ignore
            const { selectionStart, selectionEnd, value } = e.target;
            const textBeforeCursor = value.substring(0, selectionStart);
            const textAfterCursor = value.substring(selectionEnd, value.length);
            // @ts-ignore
            setQuestionText(`${textBeforeCursor}\n${textAfterCursor}`);
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
      <div style={{ position: "absolute", bottom: 0, right: 0, padding: 10 }}>
        <Button
          auto
          disabled={props.questionText.trim() == ""}
          onPress={props.send}
          color={props.loading ? "error" : "primary"}
          css={{
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 8,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
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