import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import { ChevronLeft } from "react-iconly";
export default function NavbarTItleView(props: {
  name: string;
  id: number;
  count: number;
  back?: boolean;
}) {
  let name = props.name ?? "新的会话";
  //如果name是新的会话就把id加上
  if (name === "新的会话" && props.id != -1) {
    name += props.id;
  }
  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        {props.back && (
          <a
            className={styles.link}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingRight: 8,
            }}
            onClick={() => {
              history.back();
            }}
          >
            <ArrowLeftOutlined />
          </a>
        )}
        <div className={styles.name}>{name}</div>
      </div>
      <div style={{ fontSize: 13 }} className={styles.sub}>
        共{props.count}条记录
      </div>
    </div>
  );
}
