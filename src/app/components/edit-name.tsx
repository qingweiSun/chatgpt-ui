import { Button, Grid, Popover, Row, Text } from "@nextui-org/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { context } from "@/app/hooks/context-mobile";
import { Input, Modal } from "antd";

const RESPONSIVE_MOBILE = 768;

export default function EditName(props: {
  name?: string;
  setName: (name: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const { isMobile } = useContext(context);
  const [name, setName] = useState(props.name || "");
  return (
    <Popover
      placement={"bottom-right"}
      isBordered
      offset={16}
      isOpen={visible}
      onOpenChange={(isOpen) => {
        setVisible(isOpen);
      }}
    >
      <Popover.Trigger>
        <a
          className={props.className}
          onClick={() => {
            setVisible(true);
          }}
        >
          {props.children}
        </a>
      </Popover.Trigger>
      <Popover.Content>
        <Grid.Container
          css={{ borderRadius: "14px", padding: "0.75rem", width: "220px" }}
        >
          <Row justify="center" align="center">
            <Text b>重命名</Text>
          </Row>
          <Row justify="center" align="center">
            <div style={{ padding: "16px 0" }}>
              <Input
                value={name}
                autoFocus
                placeholder="请输入名称"
                size="large"
                style={{ fontSize: 15, borderRadius: 10, borderWidth: 2 }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </Row>
          <Row justify="flex-end" align="center">
            <Button
              size="sm"
              light
              auto
              onPress={() => {
                setVisible(false);
              }}
            >
              取消
            </Button>
            <div style={{ width: 8 }} />
            <Button
              size="sm"
              shadow
              color="primary"
              auto
              onPress={() => {
                props.setName(name);
                setVisible(false);
              }}
            >
              确定
            </Button>
          </Row>
        </Grid.Container>
      </Popover.Content>
    </Popover>
  );
}
