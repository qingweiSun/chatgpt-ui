import { Button, Text } from "@nextui-org/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { context } from "@/app/hooks/context-mobile";
import { Modal, Input } from "antd";

const { TextArea } = Input;

export default function LargeInput(props: {
  className?: string;
  text?: string;
  setText: (text: string) => void;
  children: React.ReactNode;
}) {
  const [visibleLarge, setVisibleLarge] = useState(false);
  const [text, setText] = useState(props.text || "");
  const { isMobile } = useContext(context);

  useEffect(() => {
    setText(props.text || "");
  }, [props.text]);
  return (
    <>
      <a
        className={props.className}
        style={{
          height: "auto",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          justifyContent: "center",
        }}
        onClick={(event) => {
          setVisibleLarge(true);
        }}
      >
        {props.children}
      </a>
      <Modal
        title="长内容输入"
        closable={false}
        destroyOnClose
        keyboard
        width={isMobile ? "90%" : "1000px"}
        open={visibleLarge}
        centered
        onCancel={() => {
          setVisibleLarge(false);
        }}
        onOk={() => {
          setVisibleLarge(false);
          props.setText(text);
        }}
        cancelText="取消"
        okText="确定"
      >
        <div style={{ height: 8 }} />
        <TextArea
          bordered
          autoFocus
          autoSize={{ minRows: 20, maxRows: 20 }}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="请输入你想提问的问题..."
        />
        {/* <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => {
              setVisibleLarge(false);
            }}
          >
            取消
          </Button>
          <Button
            auto
            onPress={() => {
              setVisibleLarge(false);
              // @ts-ignore
              props.setText(inputRef.current.value);
            }}
          >
            确定
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}
