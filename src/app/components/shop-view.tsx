import { Buy } from "react-iconly";
import styles from "./delete.module.css";
export default function ShopView() {
  return (
    <a
      className={styles.link}
      onClick={() => {
        window.open("http://zhg12.top/?cid=14");
      }}
    >
      <Buy set="curved" />
    </a>
  );
}
