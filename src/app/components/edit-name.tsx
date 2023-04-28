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
import TextArea from "antd/es/input/TextArea";

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
        if (!isMobile) {
          setVisible(isOpen);
        }
        if (isOpen) {
          setName(props.name || "");
        }
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
          css={{ borderRadius: "14px", paddingTop: 12, width: "230px" }}
        >
          <Row justify="center" align="center">
            <Text b>重命名</Text>
          </Row>
          <div style={{ padding: 18, width: "100%" }}>
            <TextArea
              value={name}
              placeholder="请输入名称"
              size="large"
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{
                fontSize: 15,
                borderRadius: 10,
                borderWidth: 2,
                width: "100%",
              }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <Row
            justify="flex-end"
            align="center"
            style={{ paddingBottom: 12, paddingRight: 12 }}
          >
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
