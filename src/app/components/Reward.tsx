import { Button, ConfigProvider, Image, Modal, Space, Tooltip } from "antd";
import React, { useContext, useState } from "react";
import { Scan } from "react-iconly";
import { context } from "@/app/hooks/context-mobile";
import styles from "./delete.module.css";
import { Card } from "@nextui-org/react";
export default function RewardView() {
  const { isMobile } = useContext(context);

  const [rewardModalOpen, setRewardModalOpen] = useState<boolean>(false);
  return (
    <>
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
      <Modal
        title="捐赠"
        open={rewardModalOpen}
        destroyOnClose
        centered
        cancelText={"取消"}
        okText={"确定"}
        onOk={() => {
          setRewardModalOpen(false);
        }}
        onCancel={() => {
          setRewardModalOpen(false);
        }}
        footer={[]}
      >
        <div style={{ height: 8 }} />
        <Space direction={"vertical"}>
          <div style={{ fontSize: 14 }}>
            因为免费版的访问速度可能会受到限制或不稳定，因此，如果你想提速的话，可以用自己的apikey充值或者可以请我喝杯咖啡的话，我会非常感激！
          </div>
          <div style={{ padding: `16px ${isMobile ? 16 : 64}px` }}>
            <Card isHoverable>
              <Card.Body>
                <Image
                  preview={false}
                  src={"./IMG_1300.jpg"}
                  alt={"收款码"}
                  style={{ flex: 1, width: "100%", borderRadius: 32 }}
                />
              </Card.Body>
            </Card>
          </div>
        </Space>
      </Modal>
    </>
  );
}
