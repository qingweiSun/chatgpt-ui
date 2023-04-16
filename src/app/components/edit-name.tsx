import { Button, Input, Modal, Text } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

export default function EditName(props: {
  name: string;
  setName: (name: string) => void;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const nameRef = useRef();

  useEffect(() => {}, [visible]);
  return (
    <>
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        {props.children}
      </div>
      <Modal
        closeButton
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <Modal.Header>
          <Text b size={16}>
            重命名会话
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            autoFocus
            bordered
            initialValue={props.name}
            // @ts-ignore
            ref={nameRef}
            fullWidth
            color="primary"
            placeholder="请输入会话名称"
          />
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}
