import { context } from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import {
  Button,
  ConfigProvider,
  Input,
  Modal,
  Segmented,
  Slider,
  Space,
} from "antd";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { CloseSquare, Setting } from "react-iconly";
import { useMediaQuery } from "react-responsive";
import GptContext from "../hooks/use-gpt";
import styles from "./delete.module.css";

export default function ApiKeyModal(props: {}) {
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);

  const [balance, setBalance] = useState<{
    status: string;
    total_granted: any;
    message: "查询成功";
    total_used: any;
    total_available: any;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  const { mode, setMode } = useContext(AppContext);
  const { isMobile } = useContext(context);
  const { gpt, setGpt } = useContext(GptContext);
  const [defaultModel, setDefaultModel] = useState<string>(
    localStorage.getItem("defaultMode") ?? "default"
  );
  const [isElectron, setIsElectron] = useState(
    typeof navigator !== "undefined" &&
      navigator.userAgent.indexOf("Electron") !== -1
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
        <Setting set="curved" />
      </Button>
      <Modal
        title="设置"
        open={apiKeyModalOpen}
        keyboard
        destroyOnClose
        width={600}
        cancelText={"取消"}
        closeIcon={
          <a>
            <CloseSquare set="curved" />
          </a>
        }
        afterClose={() => {}}
        okText={"关闭"}
        onOk={() => {
          setApiKeyModalOpen(false);
        }}
        onCancel={() => {
          setApiKeyModalOpen(false);
        }}
        footer={[]}
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
              className="custom-prompt"
              bordered={!isDarkMode}
              size={"large"}
              style={{
                fontSize: 13,
                width: "100%",
                background: isDarkMode ? "#2b2f31" : undefined,
                color: isDarkMode ? "#cccccc" : undefined,
              }}
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
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            访问码：
            <Input
              className="custom-prompt"
              value={gpt?.password}
              bordered={!isDarkMode}
              size={"large"}
              style={{
                fontSize: 13,
                flex: 1,
                background: isDarkMode ? "#2b2f31" : undefined,
                color: isDarkMode ? "#cccccc" : undefined,
              }}
              placeholder={"请输入访问密码，如果你认识开发者，可以问他要"}
              onChange={(e) => {
                if (gpt) {
                  setGpt({ ...gpt, password: e.target.value });
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
            如果你没有 apikey，可以使用开发者提供的访问密码
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
              <Input
                placeholder={"不限制请留空"}
                bordered={!isDarkMode}
                size="large"
                className="custom-prompt"
                style={{
                  width: "100%",
                  fontSize: 13,
                  background: isDarkMode ? "#2b2f31" : undefined,
                  color: isDarkMode ? "#cccccc" : undefined,
                }}
                value={gpt?.maxTokens}
                // onBlur={(value) => {
                //   console.log(value.target.value);
                //   if (value.target.value == "") {
                //     if (gpt) {
                //       setGpt({ ...gpt, maxTokens: "" });
                //     }
                //   }
                // }}
                onChange={(e) => {
                  console.log(e);
                  if (gpt) {
                    setGpt({ ...gpt, maxTokens: e.target.value + "" });
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

          {!isMobile && (
            <Space direction={"horizontal"}>
              <div>布局：</div>
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
                      label: <div>默认</div>,
                      value: "normal",
                    },
                    {
                      label: <div>卡片</div>,
                      value: "card",
                    },
                  ]}
                  style={{ background: isDarkMode ? undefined : "#e9e9e9" }}
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
                  style={{ background: isDarkMode ? undefined : "#e9e9e9" }}
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
                        label: <div>默认</div>,
                        value: "default",
                      },
                      {
                        label: <div>简洁模式</div>,
                        value: "simple",
                      },
                    ]}
                    style={{ background: isDarkMode ? undefined : "#e9e9e9" }}
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
          {(isElectron || (gpt?.key?.length ?? 0) > 0) && (
            <Button
              loading={loading}
              style={{
                background: isDarkMode ? "#2b2f31" : undefined,
                color: isDarkMode ? "#cccccc" : undefined,
                borderColor: isDarkMode ? "#2b2f31" : undefined,
              }}
              onClick={async () => {
                setLoading(true);
                const response = await fetch(
                  "https://qingwei.icu/api/billing",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      apiKey: gpt?.key,
                    }),
                  }
                );

                if (response.status == 200) {
                  const temp = await response.json();
                  if (temp.status == "success") {
                    setBalance(temp);
                    setLoading(false);
                  } else {
                    toast.error(temp.message);
                  }
                } else {
                  setLoading(false);
                }
              }}
            >
              余额查询
            </Button>
          )}
          {balance && (
            <Space direction="vertical">
              <div style={{ marginTop: 4 }}>
                <Space direction={"vertical"}>
                  <Space direction={"vertical"}>
                    {/* <div>总额度：{balance.total_granted}注意：Budai</div> */}
                    <div>已消费额度：{balance.total_used}</div>
                    <div>剩余可用额度：{balance.total_available}</div>
                  </Space>
                </Space>
              </div>
              <div
                style={{
                  color: "#666666",
                  fontSize: 12,
                }}
              >
                剩余可用额度不代表余额奥。用的越多，付费就会越多，这只是代表的最大可用额度。
              </div>
            </Space>
          )}
        </Space>
      </Modal>
    </>
  );
}
