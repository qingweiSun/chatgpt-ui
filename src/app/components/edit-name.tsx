import { Button, Input, Modal, Text } from "@nextui-org/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const RESPONSIVE_MOBILE = 768;

export default function EditName(props: {
  name?: string;
  setName: (name: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const nameRef = useRef();


  const [isMobile, setMobileMode] = useState(
    window.innerWidth < RESPONSIVE_MOBILE
  );
  const updateSiteConfig = useCallback((props: { isMobile: boolean }) => {
    setMobileMode(props.isMobile);
  }, []);
  const updateMobileMode = () => {
    updateSiteConfig({ isMobile: window.innerWidth < RESPONSIVE_MOBILE });
  };
  useEffect(() => {
    updateMobileMode();
    window.addEventListener("resize", updateMobileMode);
    return () => {
      window.removeEventListener("resize", updateMobileMode);
    };
  }, []);
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
        width={isMobile ? "90%" : "400px"}
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
