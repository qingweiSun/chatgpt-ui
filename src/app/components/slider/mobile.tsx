import React, { useState } from "react";
import Slider from "@/app/components/slider/index";
import { Drawer } from "antd";

const RESPONSIVE_MOBILE = 768;

export default function MobileSlider(props: {
  className?: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        style={{
          height: "auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(event) => {
          setVisible(true);
        }}
      >
        {props.children}
      </div>
      <Drawer
        placement="left"
        maskClosable
        closable={false}
        onClose={() => {
          setVisible(false);
        }}
        open={visible}
        contentWrapperStyle={{ width: 300 }}
        style={{ padding: 0, backgroundColor: "transparent" }}
        bodyStyle={{ padding: 0, backgroundColor: "transparent" }}
        size={"default"}
      >
        <Slider
          isMobile={true}
          closeSlider={() => {
            setVisible(false);
          }}
        />
      </Drawer>
    </>
  );
}
