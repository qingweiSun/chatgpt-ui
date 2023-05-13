import { context } from "@/app/hooks/context-mobile";
import { Button, Card, ConfigProvider, Image, notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { Danger, Notification, Scan, VolumeUp } from "react-iconly";
import { useMediaQuery } from "react-responsive";
import { copyToClipboard } from "../pages/chat/markdown-text";
import styles from "./delete.module.css";
import { SmileOutlined } from "@ant-design/icons";

export default function RewardView() {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [isElectron, setIsElectron] = useState(
    typeof navigator !== "undefined" &&
      navigator.userAgent.indexOf("Electron") !== -1
  );
  const [rewardModalOpen, setRewardModalOpen] = useState<boolean>(false);

  function showPop() {
    notification.info({
      message: "捐赠",
      duration: 0,
      description: (
        <div
          style={{
            WebkitUserSelect: "text",
          }}
        >
          随着本站用户量的增长，成本也在逐渐增高，如果你需要更好的体验，我可以帮你自建，12美元/月的消费就可以支持到几十个人使用(
          12
          美元不是给我的)，均摊下来很便宜，你可以给别人付费使用，如果你有意请加微信：
          <a
            onClick={() => {
              copyToClipboard("18300240232");
            }}
          >
            18300240232
          </a>
          ，如果你想更好的使用本站，也欢迎支持一下；另外，请不要在微信内打开。
          <Card style={{ marginTop: 16 }}>
            <Image preview={false} src={"./IMG_1300.jpg"} alt={"收款码"} />
          </Card>
        </div>
      ),
    });
  }

  useEffect(() => {
    if (rewardModalOpen) {
      setRewardModalOpen(false);
      showPop();
    }
  }, [rewardModalOpen]);

  useEffect(() => {
    if (!isElectron) {
      //每天触发一次
      const lastShowTime = localStorage.getItem("show_notification_time") ?? "";
      const now = new Date().toLocaleDateString();
      if (lastShowTime != now) {
        localStorage.setItem("show_notification_time", now);
        setRewardModalOpen(true);
      }
    }
  }, []);
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 12,
        },
      }}
    >
      <Button
        className={styles.link}
        type={"link"}
        style={{ fontSize: 15 }}
        onClick={() => {
          setRewardModalOpen(true);
        }}
      >
        <Scan set="two-tone" size={22} />
      </Button>
    </ConfigProvider>
  );
}
