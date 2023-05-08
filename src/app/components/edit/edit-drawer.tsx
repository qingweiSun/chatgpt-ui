import { ChatMessage } from "@/app/pages/chat";
import { Button } from "@nextui-org/react";
import { Input, Modal, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { use, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function EditDrawerView(props: {
  open: boolean;
  title: string;
  content: string;
  setOpen: (open: boolean) => void;
  setContent: (content: string) => void;
}) {
  const [value, setValue] = useState(props.content);

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
            light
            bordered
            color={"default"}
            onClick={() => props.setOpen(false)}
          >
            取消
          </Button>
          <Button
            auto
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
          defaultValue={props.content}
          autoSize={{ minRows: 3, maxRows: 20 }}
          style={{ flex: 1, borderWidth: 2, fontSize: 15 }}
          placeholder="请输入内容"
          onChange={(e) => {
            setValue(e.target.value);
          }}
        ></TextArea>
      </div>
    </Modal>
  );
}
