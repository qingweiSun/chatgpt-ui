import {
  Button,
  Card,
  ConfigProvider,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Slider,
  Space,
} from "antd";
import React, { useContext, useState } from "react";
import { Setting } from "react-iconly";
import AppContext from "@/app/hooks/use-style";
import { context } from "@/app/hooks/context-mobile";
import styles from "./delete.module.css";
import GptContext from "../hooks/use-gpt";

const { TextArea } = Input;

export default function ApiKeyModal(props: {
  showCostType: "tokens" | "$" | "none";
  updateShowCostType: (e: "tokens" | "$" | "none") => void;
}) {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);

  const [balance, setBalance] = useState<
    {
      status: string;
      total_granted: any;
      message: "查询成功";
      total_used: any;
      total_available: any;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCostType, setShowCostType] = useState<"tokens" | "$" | "none">(
    props.showCostType
  );

  const { mode, setMode } = useContext(AppContext);
  const { isMobile } = useContext(context);
  const { gpt, setGpt } = useContext(GptContext);
  const [defaultModel, setDefaultModel] = useState<string>(
    localStorage.getItem("defaultMode") ?? "default"
  );

  //余额查询
  async function updateBilling(key: string) {
    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        body: JSON.stringify({
          apiKey: key,
        }),
      });
      if (!response.ok) {
        return {
          type: "error",
          message: response.statusText,
        };
      }
      return response.json();
    } catch (e) {
      return {};
    }
  }

  return (
    <>
      <Button
        className={styles.link}
        type="link"
        onClick={(event) => {
          setApiKeyModalOpen(true);
        }}
      >
        <Setting set="two-tone" />
      </Button>
      <Modal
        title="设置"
        open={apiKeyModalOpen}
        keyboard
        destroyOnClose
        width={600}
        cancelText={"取消"}
        afterClose={() => {
          setShowCostType(props.showCostType);
        }}
        okText={"关闭"}
        onOk={() => {
          setApiKeyModalOpen(false);
        }}
        onCancel={() => {
          setApiKeyModalOpen(false);
        }}
        footer={
          [
            // <Space key={"footer"}>
            //   {/* <Button
            //     onClick={async () => {
            //       setLoading(true);
            //       const newBalance: any[] = [];
            //       // if (gpt.key.length > 0) {
            //       //   for (const key of apiKey.split("\n")) {
            //       //     const v = await updateBilling(key);
            //       //     newBalance.push(v);
            //       //     setLoading(false);
            //       //   }
            //       // } else {
            //       //   setLoading(false);
            //       // }
            //     }}
            //   >
            //     余额查询
            //   </Button> */}
            //   <Button
            //     type="primary"
            //     size="large"
            //     onClick={() => {
            //       setApiKeyModalOpen(false);
            //     }}
            //   >
            //     关闭
            //   </Button>
            //   {/* <Button
            //     type={"primary"}
            //     onClick={() => {
            //       setApiKeyModalOpen(false);
            //       window.localStorage.setItem("temperature", temperature);
            //       props.updateTemperature(temperature);
            //       props.setApiKey(apiKey);
            //       props.updateShowCostType(showCostType);
            //       props.updatePresencePenalty(presencePenalty);
            //       props.updateMaxTokens(maxTokens);
            //     }}
            //   >
            //     确定
            //   </Button> */}
            // </Space>,
          ]
        }
      >
        <div style={{ height: 8 }} />
        <Space direction={"vertical"} style={{ width: "100%" }} size={16}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div>apiKey:</div>
            <Input
              value={gpt?.key}
              size={"large"}
              style={{ fontSize: 14, width: "100%" }}
              placeholder={
                "请输入您自己的apiKey，以便获得更好的体验，本站不会做任何记录"
              }
              onChange={(e) => {
                if (gpt) {
                  setGpt({ ...gpt, key: e.target.value });
                }
              }}
            />
          </div>
          <Space direction={"vertical"} size={0} style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              随机性(temperature):
              <Slider
                min={0}
                max={2}
                step={0.1}
                style={{ flex: 1 }}
                value={+(gpt?.temperature || "1")}
                onChange={(v) => {
                  if (gpt) {
                    setGpt({ ...gpt, temperature: v.toString() });
                  }
                }}
              />
            </div>
            <div
              style={{
                color: "#666666",
                fontSize: 12,
              }}
            >
              值越大，回复越随机，不建议设置过小
            </div>
          </Space>
          <Space direction={"vertical"} size={0} style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              话题新鲜度 (presence_penalty):
              <Slider
                min={-2}
                max={2}
                step={0.1}
                style={{ flex: 1 }}
                value={+(gpt?.presencePenalty || "0")}
                onChange={(v) => {
                  if (gpt) {
                    setGpt({ ...gpt, presencePenalty: v.toString() });
                  }
                }}
              />
            </div>
            <div
              style={{
                color: "#666666",
                fontSize: 12,
              }}
            >
              值越大，越有可能扩展到新话题,不建议设置过小
            </div>
          </Space>
          <Space direction={"vertical"} size={6}>
            <Space>
              max_tokens:
              <InputNumber
                placeholder={"不限制请留空"}
                style={{ width: "100%", fontSize: 13 }}
                value={gpt?.maxTokens}
                onBlur={(value) => {
                  console.log(value.target.value);
                  if (value.target.value == "") {
                    if (gpt) {
                      setGpt({ ...gpt, maxTokens: "" });
                    }
                  }
                }}
                onChange={(value) => {
                  console.log(value);
                  if (gpt) {
                    setGpt({ ...gpt, maxTokens: value + "" });
                  }
                }}
              />
            </Space>
            <div
              style={{
                color: "#666666",
                fontSize: 12,
              }}
            >
              聊天完成时生成的最大令牌数。
              输入标记和生成标记的总长度受模型上下文长度的限制。越大或者留空越会消耗apiKey的额度
            </div>
          </Space>
          {/* <Space>
            显示计费：
            <ConfigProvider
              theme={{
                token: {
                  borderRadius: 8,
                },
              }}
            >
              <Segmented
                options={[
                  {
                    label: <div>tokens</div>,
                    value: "tokens",
                  },
                  {
                    label: <div>美元</div>,
                    value: "$",
                  },
                  {
                    label: <div>不显示</div>,
                    value: "none",
                  },
                ]}
                style={{ background: "#e9e9e9" }}
                value={showCostType}
                onChange={(value) => {
                  setShowCostType(value.toString() as any);
                }}
              />
            </ConfigProvider>
          </Space> */}
          {!isMobile && (
            <Space direction={"horizontal"}>
              <div>布局：</div>
              <ConfigProvider
                theme={{
                  token: {
                    borderRadius: 8,
                  },
                }}
              >
                <Segmented
                  options={[
                    {
                      label: <div>默认</div>,
                      value: "normal",
                    },
                    {
                      label: <div>卡片</div>,
                      value: "card",
                    },
                  ]}
                  style={{ background: "#e9e9e9" }}
                  value={mode.mode ?? "card"}
                  onChange={(value) => {
                    const modeValue = {
                      mode: value.toString() as any,
                      size: "medium",
                    };
                    setMode(modeValue);
                    localStorage.setItem("mode-new", JSON.stringify(modeValue));
                  }}
                />
              </ConfigProvider>
            </Space>
          )}
          {mode.mode != "normal" && !isMobile && (
            <Space>
              <div>卡片边距：</div>
              <ConfigProvider
                theme={{
                  token: {
                    borderRadius: 8,
                  },
                }}
              >
                <Segmented
                  options={[
                    {
                      label: <div>小</div>,
                      value: "small",
                    },
                    {
                      label: <div>中</div>,
                      value: "medium",
                    },
                    {
                      label: <div>大</div>,
                      value: "large",
                    },
                  ]}
                  style={{ background: "#e9e9e9" }}
                  value={mode.size ?? "medium"}
                  onChange={(value) => {
                    const modeValue = {
                      mode: "card",
                      size: value.toString() as any,
                    };
                    setMode(modeValue);
                    localStorage.setItem("mode-new", JSON.stringify(modeValue));
                  }}
                />
              </ConfigProvider>
            </Space>
          )}
          <Space direction={"vertical"} size={6}>
            <Space>
              <div>
                创建新会话时默认使用：
                <ConfigProvider
                  theme={{
                    token: {
                      borderRadius: 8,
                    },
                  }}
                >
                  <Segmented
                    options={[
                      {
                        label: <div>默认</div>,
                        value: "default",
                      },
                      {
                        label: <div>简洁模式</div>,
                        value: "simple",
                      },
                    ]}
                    style={{ background: "#e9e9e9" }}
                    value={defaultModel}
                    onChange={(value) => {
                      localStorage.setItem("defaultMode", value.toString());
                      setDefaultModel(value.toString());
                    }}
                  />
                </ConfigProvider>
              </div>
            </Space>
            <div
              style={{
                color: "#666666",
                fontSize: 12,
              }}
            >
              简洁模式使得答案会更简练并且节省tokens，但是可能会导致答案不够优质，如果您需要更好的的答案，请点击恢复系统设定。
            </div>
          </Space>
          {balance.length > 0 && (
            <Card bordered={false} style={{ marginTop: 4 }}>
              <Space direction={"vertical"}>
                {balance.map((item, index) => {
                  return item.status == "success" ? (
                    <Space key={index} direction={"vertical"}>
                      <div>总额度：{item.total_granted}</div>
                      <div>已使用额度：{item.total_used}</div>
                      <div>剩余可用额度：{item.total_available}</div>
                    </Space>
                  ) : (
                    <div key={index}>{item.message}</div>
                  );
                })}
              </Space>
            </Card>
          )}
        </Space>
        <div style={{ height: 12 }} />
      </Modal>
    </>
  );
}
