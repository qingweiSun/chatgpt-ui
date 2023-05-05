import { Drawer, Dropdown, Input, Space } from "antd";
import { useState } from "react";
import EditName from "../edit-name";
import { ChevronDown, Edit } from "react-iconly";
import { ChatMessage } from "@/app/pages/chat";
import { Button } from "@nextui-org/react";

export function EditDrawerView(props: {
  open: boolean;
  title: string;
  setOpen: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  return (
    <Drawer
      title={props.title}
      placement={"right"}
      width={"calc(100% - 300px)"}
      closable={false}
      onClose={() => {
        props.setOpen(false);
      }}
      style={{
        background: "#7f7f7",
      }}
      open={props.open}
      getContainer={false}
      key={"EditDrawerView"}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <div>添加前置消息</div>
        <div style={{ width: "100%", display: "flex", gap: 12 }}>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  label: "system",
                  key: "system",
                },
                {
                  label: "user",
                  key: "user",
                },
                {
                  key: "assistant",
                  label: "assistant",
                },
              ],
            }}
          >
            <Button
              auto
              color={"primary"}
              icon=<ChevronDown size={18} set="curved" />
              onClick={() => {}}
              light
              bordered
            >
              选择角色
            </Button>
          </Dropdown>
          <Input
            size="large"
            style={{ flex: 1, borderWidth: 2, fontSize: 15 }}
            placeholder="请输入内容"
          ></Input>
        </div>
      </Space>
    </Drawer>
  );
}

/* 
            
 */
