import {Button, Modal, Text} from "@nextui-org/react";
import React, {useCallback, useEffect, useState} from "react";
import {ChatMessage} from "@/app/pages/chat";
import toast from "react-hot-toast";
import packageJson from "../../../package.json";

const RESPONSIVE_MOBILE = 768;

export default function SettingModal(props: {
    className?: string;
    children: React.ReactNode;
}) {
    const [visible, setVisible] = useState(false);

    const [isMobile, setMobileMode] = useState(
        window.innerWidth < RESPONSIVE_MOBILE
    );
    const updateSiteConfig = useCallback((props: { isMobile: boolean }) => {
        setMobileMode(props.isMobile);
    }, []);
    const updateMobileMode = () => {
        updateSiteConfig({isMobile: window.innerWidth < RESPONSIVE_MOBILE});
    };
    useEffect(() => {
        updateMobileMode();
        window.addEventListener("resize", updateMobileMode);
        return () => {
            window.removeEventListener("resize", updateMobileMode);
        };
    }, []);
    return (
        <>
            <Button auto light onClick={(event) => {
                setVisible(true);
            }}>
                {props.children}
            </Button>

            <Modal
                width={isMobile ? "90%" : "400px"}
                closeButton
                open={visible}
                onClose={() => {
                    setVisible(false);
                }}
            >
                <Modal.Header>
                    <Text b size={16}>
                        设置
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    待开发v{packageJson.version}
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
                            // @ts-ignore
                            props.setName(nameRef.current.value);
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
                    .map((m) => `${m.data.role == "user" ? `## **${m.data.role}**: ` : `**${m.data.role}**:`}${m.data.content}`)
                    .join("\r\n\n")
            ],
            {type: "text/plain;charset=utf-8"}
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
