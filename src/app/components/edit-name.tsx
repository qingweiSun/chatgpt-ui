import { Button, Input, Text } from "@nextui-org/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { context } from "@/app/hooks/context-mobile";
import { Modal } from "antd";

const RESPONSIVE_MOBILE = 768;

export default function EditName(props: {
  name?: string;
  setName: (name: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const nameRef = useRef();
  const { isMobile } = useContext(context);

  return (
    <>
      <a
        className={props.className}
        style={{
          height: "auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(event) => {
          setVisible(true);
        }}
      >
        {props.children}
      </a>
      <Modal
        title="重命名"
        closable={false}
        destroyOnClose
        keyboard
        width={isMobile ? "90%" : "400px"}
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
          // @ts-ignore
          props.setName(nameRef.current.value);
        }}
        cancelText="取消"
        okText="确定"
      >
        <div style={{ height: 8 }} />
        <Input
          autoFocus
          bordered
          initialValue={props.name}
          // @ts-ignore
          ref={nameRef}
          css={{
            backgroundColor: "#ffffff",
          }}
          fullWidth
          color="primary"
          placeholder="请输入会话名称"
        />
        {/* <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => {
              setVisible(false);
            }}
          >
            取消
          </Button>
          <Button
            auto
            onPress={() => {
              setVisible(false);
              // @ts-ignore
              props.setName(nameRef.current.value);
            }}
          >
            确定
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}
