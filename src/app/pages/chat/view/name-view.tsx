import styles from "../index.module.css";
export default function NavbarTItleView(props: {
  name: string;
  id: number;
  count: number;
  back?: boolean;
}) {
  let name = props.name ?? "新的会话";

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <div className={styles.name}>{name}</div>
      </div>
      <div style={{ fontSize: 13 }} className={styles.sub}>
        共{props.count}条记录
      </div>
    </div>
  );
}
