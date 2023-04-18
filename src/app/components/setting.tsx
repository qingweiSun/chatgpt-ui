import { Button, Checkbox, Modal, Radio, Text } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { ChatMessage } from "@/app/pages/chat";
import toast from "react-hot-toast";
import AppContext from "@/app/hooks/use-style";
import { context } from "@/app/hooks/context-mobile";

const RESPONSIVE_MOBILE = 768;

export default function SettingModal(props: {
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  const { mode, setMode } = useContext(AppContext);
  const { isMobile } = useContext(context);

  return (
    <>
      <Button
        auto
        light
        onClick={(event) => {
          setVisible(true);
        }}
      >
        {props.children}
      </Button>

      <Modal
        width={isMobile ? "90%" : "700px"}
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <div style={{ padding: 16 }}>
          <Text b size={16}>
            设置
          </Text>
        </div>
        <Modal.Body>
          <div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ fontSize: 16 }}>卡片布局</div>
              <Checkbox
                size={"md"}
                css={{
                  transform: "scale(0.9)",
                }}
                isSelected={mode.mode == "card"}
                onChange={(isSelected) => {
                  setMode(
                    isSelected
                      ? {
                          mode: "card",
                          size: "medium",
                        }
                      : {
                          mode: "normal",
                        }
                  );
                  localStorage.setItem(
                    "mode-new",
                    isSelected
                      ? JSON.stringify({
                          mode: "card",
                          size: "medium",
                        })
                      : JSON.stringify({
                          mode: "normal",
                        })
                  );
                }}
              />
            </div>
            <div style={{ color: "#777777", fontSize: 11, marginTop: 4 }}>
              适用于大屏，UI更美观,移动端不生效
            </div>
            {mode.mode == "card" && (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <div style={{ fontSize: 16 }}>卡片模式下间距</div>
                <Radio.Group
                  orientation="horizontal"
                  defaultValue={mode.size || "medium"}
                  size={"sm"}
                  onChange={(value) => {
                    setMode({
                      mode: "card",
                      size: value,
                    });
                    localStorage.setItem(
                      "mode-new",
                      JSON.stringify({
                        mode: "card",
                        size: value,
                      })
                    );
                  }}
                >
                  <Radio value="small">小</Radio>
                  <Radio value="medium">中</Radio>
                  <Radio value="large">大</Radio>
                </Radio.Group>
              </div>
            )}
          </div>
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
            }}
          >
            确定
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function exportMarkdown(props: { messages: ChatMessage[] }) {
  //过滤掉系统消息
  const outputList = props.messages.filter((e) => {
    return e.data.role != "system";
  });
  if (outputList.length > 0) {
    const blob = new Blob(
      [
        props.messages
          .map(
            (m) =>
              `${
                m.data.role == "user"
                  ? `## **${m.data.role}**: `
                  : `**${m.data.role}**:`
              }${m.data.content}`
          )
          .join("\r\n\n"),
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    //获取当前时间戳
    const timestamp = new Date().getTime();
    a.download = `message_${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    toast.success("导出成功，等待浏览器下载");
  } else {
    toast.error("没有数据可以导出");
  }
}
