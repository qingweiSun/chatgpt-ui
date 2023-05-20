import {
  Button,
  Grid,
  NextUIProvider,
  Popover,
  Row,
  Text,
} from "@nextui-org/react";
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
import { useMediaQuery } from "react-responsive";
import { toast } from "react-hot-toast";

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
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

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
          css={{
            borderRadius: "14px",
            paddingTop: 12,
            width: "240px",
            //@ts-ignore
            "-webkit-app-region": "no-drag",
          }}
        >
          <Row justify="center" align="center">
            <Text b color={isDarkMode ? "#cccccc" : undefined}>
              重命名
            </Text>
          </Row>
          <div style={{ padding: 18, width: "100%" }}>
            <TextArea
              className="custom-prompt"
              value={name}
              placeholder="请输入名称"
              size="large"
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{
                fontSize: 15,
                borderRadius: 10,
                borderWidth: 2,
                width: "100%",
                // borderColor: isDarkMode ? "#333333" : undefined,
                backgroundColor: isDarkMode ? "#2b2f31" : undefined,
                color: isDarkMode ? "#cccccc" : undefined,
              }}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.altKey) {
                  e.preventDefault();
                  // @ts-ignore
                  const { selectionStart, selectionEnd, value } = e.target;
                  const textBeforeCursor = value.substring(0, selectionStart);
                  const textAfterCursor = value.substring(
                    selectionEnd,
                    value.length
                  );
                  setName(`${textBeforeCursor}\n${textAfterCursor}`);
                  // 将光标移到新行的开头
                  // @ts-ignore
                  e.target.selectionStart = selectionEnd + 1;
                  // @ts-ignore
                  e.target.selectionEnd = selectionEnd + 1;
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  props.setName(name);
                  setVisible(false);
                }
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
              css={{
                color: isDarkMode ? "#cccccc" : undefined,
              }}
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
