import { apiStore } from "@/app/http/api-stores";
import { Button } from "@nextui-org/react";
import { Card, ConfigProvider, Input, Modal, Space } from "antd";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AddUser, Message, Password, User } from "react-iconly";
import styles from "../delete.module.css";
import styleUser from "./user.module.css";
import { UserEntity } from "@/app/entity/user-entity";
import { useMediaQuery } from "react-responsive";
export default function UserInfoView(props: {}) {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [isRegUI, setIsRegUI] = useState(false);
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [password2, updatePassword2] = useState("");
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [isLogin, setIsLogin] = useState<boolean>(
    localStorage.getItem("token") != null
  );
  const [user, setUser] = useState<UserEntity | null>(
    JSON.parse(localStorage.getItem("user") ?? "{}")
  );
  async function login() {
    if (username === "") {
      toast.error("请输入邮箱/手机号");
      return;
    }
    if (password === "") {
      toast.error("请输入密码");
      return;
    }
    try {
      const data = await apiStore.login(username, password).query();
      if (data?.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
        setIsModalLoginOpen(false);
        setIsLogin(true);
        setUser(data.data);
        toast.success("登录成功");
      } else {
        toast.error(data?.message ?? "登录失败");
      }
    } catch (e: any) {
      toast.error(e.toString());
    }
  }

  async function register() {
    if (username === "") {
      toast.error("请输入邮箱/手机号");
      return;
    }
    if (password !== password2) {
      toast.error("两次输入的密码不一致");
      return;
    }
    try {
      const data = await apiStore.register(username, password).query();
      if (data?.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
        setIsModalLoginOpen(false);
        setIsLogin(true);
        setUser(data.data);
        toast.success("注册成功");
      } else {
        toast.error(data?.message ?? "注册失败");
      }
    } catch (e: any) {
      toast.error(e.toString());
    }
  }
  return (
    <>
      <a
        className={styles.link}
        type="link"
        onClick={(event) => {
          if (isLogin) {
            //已经登录
            setIsModalUserOpen(true);
          } else {
            setIsModalLoginOpen(true);
          }
        }}
      >
        {isLogin ? <User set="curved" /> : <AddUser set="curved" />}
      </a>
      <Modal
        title={isRegUI ? "注册" : "登录"}
        width={400}
        destroyOnClose
        open={isModalLoginOpen}
        onOk={() => {}}
        onCancel={() => {
          setIsModalLoginOpen(false);
        }}
        footer={[]}
      >
        <ConfigProvider
          theme={{
            token: isDarkMode
              ? {
                  colorBgContainer: "#1b1b1b",
                  colorTextBase: "#bbbbbb",
                  colorBgSpotlight: "#111111",
                  colorBorder: "#444444",
                }
              : {},
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={12}>
            <div style={{ fontSize: 20 }}>
              {isRegUI ? "输入邮箱/手机号后注册" : "欢迎回来！"}
            </div>
            <Input
              placeholder="请输入邮箱/手机号"
              value={username}
              onChange={(event) => {
                updateUsername(event.target.value);
              }}
              size="large"
              prefix={<Message set="curved" size={20} />}
              style={{
                borderWidth: 2,
                fontSize: 14,
                height: 44,
              }}
            />
            <Input.Password
              placeholder="请输入密码"
              size="large"
              value={password}
              onChange={(event) => {
                updatePassword(event.target.value);
              }}
              prefix={<Password set="curved" size={20} />}
              style={{
                borderWidth: 2,
                fontSize: 14,
                height: 44,
              }}
            />
            {isRegUI && (
              <Input.Password
                placeholder="请再次输入密码"
                size="large"
                value={password2}
                onChange={(event) => {
                  updatePassword2(event.target.value);
                }}
                prefix={<Password set="curved" size={20} />}
                style={{
                  borderWidth: 2,
                  fontSize: 14,
                  height: 44,
                }}
              />
            )}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <a
                className={styleUser.reg}
                onClick={() => {
                  setIsRegUI(!isRegUI);
                }}
              >
                {!isRegUI ? "没有账号？去注册" : "已有账号，去登录"}
              </a>
            </div>
            <Button
              css={{ width: "100%", height: 44, fontSize: 15 }}
              onClick={() => {
                if (isRegUI) {
                  // 注册
                  register();
                } else {
                  login();
                }
              }}
            >
              {!isRegUI ? "登录" : "注册"}
            </Button>
          </Space>
        </ConfigProvider>
      </Modal>
      <Modal
        title={"用户信息"}
        width={400}
        destroyOnClose
        open={isModalUserOpen}
        onOk={() => {}}
        onCancel={() => {
          setIsModalUserOpen(false);
        }}
        footer={[
          <Space key={"logout"}>
            <Button
              auto
              light
              flat
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsLogin(false);
                setUser(null);
                setIsModalUserOpen(false);
                toast.success("退出成功");
              }}
            >
              退出
            </Button>
          </Space>,
        ]}
      >
        <ConfigProvider
          theme={{
            token: isDarkMode
              ? {
                  colorBgContainer: "#1b1b1b",
                  colorTextBase: "#bbbbbb",
                  colorBgSpotlight: "#111111",
                  colorBorder: "#444444",
                }
              : {},
          }}
        >
          <Card>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              <Space size={0}>
                <div style={{ fontWeight: 500 }}>用户名：</div>
                <div style={{ fontWeight: 500 }}>{user?.username}</div>
              </Space>
              <Space size={0}>
                <div style={{ fontWeight: 500 }}>注册时间：</div>
                <div style={{ fontWeight: 500 }}>{user?.createdAt}</div>
              </Space>
            </Space>
          </Card>
        </ConfigProvider>
      </Modal>
    </>
  );
}
