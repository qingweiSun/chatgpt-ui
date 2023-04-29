import { context } from "@/app/hooks/context-mobile";
import { Button, Card, ConfigProvider, Image, Space } from "antd";
import { useContext, useState } from "react";
import { CloseSquare, Scan } from "react-iconly";
import { useMediaQuery } from "react-responsive";
import styles from "./delete.module.css";
import { Modal, Text } from "@nextui-org/react";
export default function RewardView() {
  const { isMobile } = useContext(context);
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

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
        // closeIcon={
        //   <CloseSquare
        //     set="curved"
        //     primaryColor={isDarkMode ? "#bbbbbb" : undefined}
        //   />
        // }
        // onOk={() => {
        //   setRewardModalOpen(false);
        // }}
        onClose={() => {
          setRewardModalOpen(false);
        }}
        // footer={[]}
      >
        <Modal.Header>
          <Text b size={16}>
            捐赠
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Space direction={"vertical"}>
            <div style={{ fontSize: 14 }}>
              因为免费版的访问速度可能会受到限制或不稳定，因此，如果你想提速的话，可以用自己的apikey充值或者可以请我喝杯咖啡的话，我会非常感激！
            </div>
            <div style={{ padding: `16px ${isMobile ? 16 : 64}px` }}>
              <Card hoverable bordered>
                <Image
                  preview={false}
                  src={"./IMG_1300.jpg"}
                  alt={"收款码"}
                  style={{ flex: 1, width: "100%", borderRadius: 32 }}
                />
              </Card>
            </div>
          </Space>
        </Modal.Body>
      </Modal>
    </>
  );
}
