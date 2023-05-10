import { Navbar } from "@nextui-org/react";
import styles from "../index.module.css";
import toast from "react-hot-toast";
export default function NavbarTItleView(props: {
  name: string;
  id: number;
  count: number;
}) {
  let name = props.name ?? "新的会话";
  //如果name是新的会话就把id加上
  if (name === "新的会话" && props.id != -1) {
    name += props.id;
  }
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <div className={styles.name}>{name}</div>
      </div>
      <div style={{ fontSize: 13 }} className={styles.sub}>
        共{props.count}条记录
      </div>
    </div>
  );
}
