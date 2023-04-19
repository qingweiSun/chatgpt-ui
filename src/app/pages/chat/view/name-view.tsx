import { Navbar } from "@nextui-org/react";
import styles from "../index.module.css";
export default function NavbarTItleView(props: {
  name: string;
  count: number;
}) {
  return (
    <Navbar.Brand>
      <div>
        <div className={styles.nmaep}>
          <div className={styles.name}>{props.name || "新的会话"}</div>
        </div>
        <div style={{ fontSize: 13 }}>共{props.count}条记录</div>
      </div>
    </Navbar.Brand>
  );
}
