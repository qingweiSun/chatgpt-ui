import MobileSlider from "@/app/components/slider/mobile";
import { context } from "@/app/hooks/context-mobile";
import GptContext from "@/app/hooks/use-gpt";
import AppContext from "@/app/hooks/use-style";
import { Navbar } from "@nextui-org/react";
import {
  Button,
  Card,
  ConfigProvider,
  Divider,
  Input,
  Segmented,
  Slider,
  Space,
} from "antd";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { CloseSquare, MoreSquare } from "react-iconly";
import { useMediaQuery } from "react-responsive";
import styles from "../chat/index.module.css";
import styleSetting from "./index.module.css";
import NavbarTItleView from "../chat/view/name-view";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../chat/markdown-text";
import { util } from "@/app/utils/util";
export default function SettingView() {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const navigate = useNavigate();
  const [balance, setBalance] = useState<{
    balanceTotal: any;
    balanceUsed: any;
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const { mode, setMode } = useContext(AppContext);
  const { gpt, setGpt } = useContext(GptContext);
  const [defaultModel, setDefaultModel] = useState<string>(
    localStorage.getItem("defaultMode") ?? "default"
  );
  const [isElectron, setIsElectron] = useState(
    typeof navigator !== "undefined" &&
      navigator.userAgent.indexOf("Electron") !== -1
  );

  return (
    <div className={styles.container}>
      <div
        style={{
          height: "100%",
          overflowY: "scroll",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Navbar
          className={styles.navbar}
          variant="sticky"
          maxWidth={"fluid"}
          disableShadow
          onDoubleClick={() => {
            try {
              // 发送放大窗口的消息给主进程
              const electron = window.require("electron");
              electron.ipcRenderer.send("maximize-window");
            } catch (e) {}
          }}
          containerCss={{
            backgroundColor: isDarkMode
              ? "rgba(17, 17, 17, 0.8) !important"
              : "rgba(243, 243, 243, 0.7) !important",
            borderBottom: `1px solid ${isDarkMode ? "#1c1c1c" : "#ebebeb"}`,
            minHeight: 68,
            height: 68,
          }}
        >
          {!isMobile && (
            <Navbar.Brand data-tauri-drag-region>
              <NavbarTItleView name={"设置"} count={8} id={2} back />
            </Navbar.Brand>
          )}
          <Navbar.Content>
            {isMobile && (
              <Navbar.Item>
                <div className={styles.toggle} onClick={() => {}}>
                  <MobileSlider>
                    <div className={styles.link}>
                      <MoreSquare set="curved" size={23} />
                    </div>
                  </MobileSlider>
                </div>
              </Navbar.Item>
            )}
            <Navbar.Item>
              <a
                className={styles.link}
                onClick={() => {
                  const tempPathName =
                    window.sessionStorage.getItem("tempPathName") ?? "";
                  if (tempPathName.length > 0) {
                    navigate(tempPathName);
                  } else {
                    navigate(-1);
                  }
                }}
              >
                <CloseSquare set="curved" size={23} />
              </a>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
        <ConfigProvider
          theme={{
            token: isDarkMode
              ? {
                  borderRadius: 8,
                  colorBgContainer: "#191919",
                  colorBgBase: "#333333",
                  colorTextBase: "#bbbbbb",
                  colorBgSpotlight: "#111111",
                  paddingLG: 14,
                  marginLG: 14,
                  fontSize: 13,
                }
              : {
                  borderRadius: 8,
                  paddingLG: 14,
                  marginLG: 14,
                  fontSize: 13,
                },
          }}
        >
          <div
            style={{
              padding: isMobile ? 12 : 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 14,
              color: isDarkMode ? "#cccccc" : undefined,
            }}
          >
            <div
              className={styleSetting["list-item"]}
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: isDarkMode ? "#cccccc" : undefined,
              }}
            >
              访问设置
            </div>
            <Card
              className={styleSetting["list-item"]}
              bordered
              style={{
                borderRadius: 14,
                borderColor: isDarkMode ? "#222222" : "#ebebeb",
              }}
            >
              {/* <div style={{ fontSize: 14 }}>
                随着本站用户量的增长，成本也在逐渐增高，如果你需要更好的体验，我可以帮你自建，你可以自行充值额度，也可以给别人付费使用，如果你有意请加微信：
                <a
                  onClick={() => {
                    copyToClipboard("18300240232");
                  }}
                >
                  18300240232
                </a>
              </div> */}
              {/* <Divider /> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  marginTop: 2,
                }}
              >
                <div style={{ fontWeight: 500 }}>密钥:</div>
                <Input
                  value={gpt?.key}
                  className="custom-prompt"
                  style={{
                    fontSize: 13,
                    flex: isMobile ? 1 : 0.7,
                    background: isDarkMode ? "#2b2f31" : undefined,
                    color: isDarkMode ? "#cccccc" : undefined,
                  }}
                  placeholder={"请输入密钥"}
                  onChange={(e) => {
                    if (gpt) {
                      setGpt({ ...gpt, key: e.target.value });
                    }
                  }}
                />
              </div>
              {/* <div
                style={{
                  color: "#666666",
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                请输入您自己的apiKey，以便获得更好的体验，本站不会做任何记录
              </div> */}
              {/* <Divider /> */}
              {/* <Space>
                <div style={{ fontWeight: 500 }}>访问码:</div>
                <Input
                  className="custom-prompt"
                  value={gpt?.password}
                  style={{
                    fontSize: 13,
                    background: isDarkMode ? "#2b2f31" : undefined,
                    color: isDarkMode ? "#cccccc" : undefined,
                  }}
                  placeholder={"请输入访问密码"}
                  onChange={(e) => {
                    if (gpt) {
                      setGpt({ ...gpt, password: e.target.value });
                    }
                  }}
                />
              </Space> */}
              <div
                style={{
                  color: "#666666",
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                如果你没有密钥，请在此处后买：
                <a href="http://zhg12.top/?cid=14">http://zhg12.top/?cid=14</a>
              </div>
              {(isElectron || (gpt?.key?.length ?? 0) > 0) && <Divider />}
              {(isElectron || (gpt?.key?.length ?? 0) > 0) && (
                <Space>
                  <div>
                    已消费：${balance?.balanceUsed ?? "未知"}，最高额度： $
                    {balance?.balanceTotal ?? "未知"}
                  </div>
                  <div />
                  <Button
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const response = await fetch("/api/gpt/balance", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          apiKey: gpt?.key,
                        }),
                      });
                      if (response.status == 200) {
                        const temp = await response.json();
                        if (temp.ok) {
                          setBalance(temp);
                          setLoading(false);
                        } else {
                          if (temp.status == "success") {
                            setBalance({
                              balanceTotal: temp.total_granted,
                              balanceUsed: temp.total_used,
                            });
                            setLoading(false);
                          } else {
                            toast.error(temp.message);
                            setLoading(false);
                          }
                        }
                      } else {
                        setLoading(false);
                        toast.error(response.statusText);
                      }
                    }}
                  >
                    余额查询
                  </Button>
                  {/* <Button
                    onClick={() => {
                      //打开新的标签
                      window.open("https://api.chatanywhere.cn");
                    }}
                  >
                    明细
                  </Button> */}
                </Space>
              )}
            </Card>
            <div
              className={styleSetting["list-item"]}
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: isDarkMode ? "#cccccc" : undefined,
                marginTop: 12,
              }}
            >
              ai设置
            </div>
            <Card
              className={styleSetting["list-item"]}
              style={{
                borderRadius: 14,
                borderColor: isDarkMode ? "#222222" : "#ebebeb",
              }}
            >
              <Space direction={"vertical"} size={0} style={{ width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ fontWeight: 500 }}>随机性：</div>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    style={{ flex: isMobile ? 1 : 0.5 }}
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
              <Divider />
              <Space direction={"vertical"} size={0} style={{ width: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ fontWeight: 500 }}>话题新鲜度：</div>
                  <Slider
                    min={-2}
                    max={2}
                    step={0.1}
                    style={{ flex: isMobile ? 1 : 0.5 }}
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
              <Divider />
              <Space direction={"vertical"} size={6}>
                <Space>
                  <div style={{ fontWeight: 500 }}>最大输出:</div>
                  <Input
                    placeholder={"不限制请留空"}
                    className="custom-prompt"
                    style={{
                      width: "100%",
                      fontSize: 13,
                      background: isDarkMode ? "#2b2f31" : undefined,
                      color: isDarkMode ? "#cccccc" : undefined,
                    }}
                    value={gpt?.maxTokens}
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
                  输入标记和生成标记的总长度受模型上下文长度的限制。越大或者留空越会消耗apiKey的额度，请自己尝试合理取值
                </div>
              </Space>
            </Card>
            {!isMobile && (
              <div
                className={styleSetting["list-item"]}
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: isDarkMode ? "#cccccc" : undefined,
                  marginTop: 12,
                }}
              >
                ui设置
              </div>
            )}
            {!isMobile && (
              <Card
                className={styleSetting["list-item"]}
                style={{
                  borderRadius: 14,
                  borderColor: isDarkMode ? "#222222" : "#ebebeb",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Space direction={"horizontal"}>
                    <div style={{ fontWeight: 500 }}>布局：</div>
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
                      style={{
                        background: isDarkMode ? undefined : "#e9e9e9",
                      }}
                      value={mode.mode ?? "card"}
                      onChange={(value) => {
                        const modeValue = {
                          mode: value.toString() as any,
                          size: "medium",
                        };
                        setMode(modeValue);
                        localStorage.setItem(
                          "mode-new",
                          JSON.stringify(modeValue)
                        );
                      }}
                    />
                  </Space>
                  {mode.mode != "normal" && <Divider />}
                  {mode.mode != "normal" && (
                    <Space>
                      <div style={{ fontWeight: 500 }}>卡片边距：</div>
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
                        style={{
                          background: isDarkMode ? undefined : "#e9e9e9",
                        }}
                        value={mode.size ?? "medium"}
                        onChange={(value) => {
                          const modeValue = {
                            mode: "card",
                            size: value.toString() as any,
                          };
                          setMode(modeValue);
                          localStorage.setItem(
                            "mode-new",
                            JSON.stringify(modeValue)
                          );
                        }}
                      />
                    </Space>
                  )}
                </div>
              </Card>
            )}
            <div
              className={styleSetting["list-item"]}
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: isDarkMode ? "#cccccc" : undefined,
                marginTop: 12,
              }}
            >
              其他设置
            </div>
            <Card
              className={styleSetting["list-item"]}
              style={{
                borderRadius: 14,
                borderColor: isDarkMode ? "#222222" : "#ebebeb",
              }}
            >
              <Space direction={"vertical"} size={6}>
                <Space>
                  <div style={{ fontWeight: 500 }}>创建新会话时默认使用：</div>
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
                    style={{
                      background: isDarkMode ? undefined : "#e9e9e9",
                    }}
                    value={defaultModel}
                    onChange={(value) => {
                      localStorage.setItem("defaultMode", value.toString());
                      setDefaultModel(value.toString());
                    }}
                  />
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
            </Card>
          </div>
        </ConfigProvider>
      </div>
    </div>
  );
}
