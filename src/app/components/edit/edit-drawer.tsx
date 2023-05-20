import { ChatMessage } from "@/app/pages/chat";
import { Button } from "@nextui-org/react";
import { ConfigProvider, Input, Modal, Segmented, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { use, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

export function EditDrawerView(props: {
  open: boolean;
  title: string;
  content: string;
  setOpen: (open: boolean) => void;
  setContent: (content: string) => void;
}) {
  const [value, setValue] = useState(props.content);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  useEffect(() => {
    setValue(props.content);
  }, [props.open]);
  return (
    <Modal
      title={props.title}
      closable={false}
      width={800}
      style={{
        background: "#7f7f7",
        // @ts-ignore
        "-webkit-app-region": "no-drag",
      }}
      onCancel={() => props.setOpen(false)}
      open={props.open}
      getContainer={false}
      key={"EditDrawerView"}
      destroyOnClose
      footer={[
        <Space key={"footer"}>
          <Button
            auto
            flat
            color="error"
            size={"sm"}
            onClick={() => props.setOpen(false)}
          >
            取消
          </Button>
          <Button
            auto
            size={"sm"}
            onClick={() => {
              if (value.trim().length === 0) {
                toast.error("请输入内容");
              }
              props.setContent(value);
              props.setOpen(false);
            }}
          >
            保存
          </Button>
        </Space>,
      ]}
    >
      <div style={{ height: 4 }} />
      <div style={{ width: "100%", display: "flex", gap: 12 }}>
        <TextArea
          size="large"
          value={value}
          autoFocus
          defaultValue={props.content}
          autoSize={{ minRows: 3, maxRows: 20 }}
          style={{
            flex: 1,
            borderWidth: 2,
            fontSize: 15,
            background: isDarkMode ? "#111111" : undefined,
          }}
          placeholder="请输入内容"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        ></TextArea>
      </div>
    </Modal>
  );
}

export function AddDrawerView(props: {
  open: boolean;
  role?: "system" | "user" | "assistant";
  content: string;
  setOpen: (open: boolean) => void;
  setContent: (content: string, role: "system" | "user" | "assistant") => void;
}) {
  const [value, setValue] = useState(props.content);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [role, setRole] = useState<"system" | "user" | "assistant">(
    props.role ?? "user"
  );
  useEffect(() => {
    setValue(props.content);
    setRole(props.role ?? "user");
  }, [props.open]);
  return (
    <Modal
      title={
        <Space>
          <div style={{ fontSize: 15 }}>选择角色：</div>
          <ConfigProvider
            theme={{
              token: isDarkMode
                ? {
                    borderRadius: 8,
                    colorBgBase: "#2b2f31",
                    colorFillSecondary: "transparent",
                    colorTextBase: "#eeeeee",
                  }
                : {
                    borderRadius: 8,
                  },
            }}
          >
            <Segmented
              options={[
                {
                  label: <div>system</div>,
                  value: "system",
                },
                {
                  label: <div>user</div>,
                  value: "user",
                },
                {
                  label: <div>assistant</div>,
                  value: "assistant",
                },
              ]}
              style={{ background: isDarkMode ? undefined : "#e9e9e9" }}
              value={role}
              onChange={(value) => {
                // @ts-ignore
                setRole(value);
              }}
            />
          </ConfigProvider>
        </Space>
      }
      closable={false}
      width={800}
      style={{
        background: "#7f7f7",
        // -webkit-app-region: drag;
        // @ts-ignore
        "-webkit-app-region": "no-drag",
      }}
      onCancel={() => props.setOpen(false)}
      open={props.open}
      getContainer={false}
      key={"EditDrawerView"}
      destroyOnClose
      footer={[
        <Space key={"footer"}>
          <Button
            auto
            flat
            color="error"
            size={"sm"}
            onClick={() => props.setOpen(false)}
          >
            取消
          </Button>
          <Button
            auto
            size={"sm"}
            onClick={() => {
              if (value.trim().length === 0) {
                toast.error("请输入内容");
              }
              props.setContent(value, role);
              props.setOpen(false);
            }}
          >
            保存
          </Button>
        </Space>,
      ]}
    >
      <div style={{ height: 4 }} />
      <div style={{ width: "100%", display: "flex", gap: 12 }}>
        <TextArea
          size="large"
          autoFocus
          value={value}
          defaultValue={props.content}
          autoSize={{ minRows: 3, maxRows: 20 }}
          style={{
            flex: 1,
            borderWidth: 2,
            fontSize: 15,
            background: isDarkMode ? "#111111" : undefined,
          }}
          placeholder="请输入内容"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        ></TextArea>
      </div>
    </Modal>
  );
}
