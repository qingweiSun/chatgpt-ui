import { Button, Modal, Text, Textarea } from "@nextui-org/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { context } from "@/app/hooks/context-mobile";

const RESPONSIVE_MOBILE = 768;

export default function LargeInput(props: {
  className?: string;
  setText: (text: string) => void;
  children: React.ReactNode;
}) {
  const [visibleLarge, setVisibleLarge] = useState(false);
  const inputRef = useRef();
  const { isMobile } = useContext(context);

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
        width={isMobile ? "90%" : "1000px"}
        open={visibleLarge}
        onClose={() => {
          setVisibleLarge(false);
        }}
      >
        <div style={{ padding: 16 }}>
          <Text b size={16}>
            长内容输入
          </Text>
        </div>
        <div style={{ padding: "0 24px" }}>
          <Textarea
            autoFocus
            bordered
            minRows={20}
            maxRows={40}
            // @ts-ignore
            ref={inputRef}
            fullWidth
            color="primary"
            placeholder="请输入你想提问的问题..."
          />
        </div>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}
