import {Modal} from "@nextui-org/react";
import React, {useState} from "react";
import Slider from "@/app/components/slider/index";

const RESPONSIVE_MOBILE = 768;

export default function MobileSlider(props: {
    children: React.ReactNode;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <a
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
            </a>
            <Modal
                fullScreen
                open={visible}
                css={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                onClose={() => {
                    setVisible(false);
                }}
            >
                <div
                    style={{width: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)",height: "100%"}}
                    onClick={() => {
                        setVisible(false);
                    }}>
                    <Slider isMobile={true} closeSlider={()=>{
                        setVisible(false);
                    }}/>
                </div>

            </Modal>
        </>
    );
}
