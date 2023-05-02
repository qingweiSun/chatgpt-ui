import { Button, Navbar, Popover } from "@nextui-org/react";
import styles from "../pages/chat/index.module.css";
import { Bookmark } from "react-iconly";
export default function TemplateView() {
  return (
    <Navbar.Item>
      <Popover isBordered placement="bottom-right">
        <Popover.Trigger>
          <a className={styles.link} onClick={() => {}}>
            <Bookmark set="curved" size={23} />
          </a>
        </Popover.Trigger>
        <Popover.Content
          css={{
            padding: 12,
          }}
        >
          <Button light bordered>
            将以下对话保存为模板
          </Button>
        </Popover.Content>
      </Popover>
    </Navbar.Item>
  );
}
