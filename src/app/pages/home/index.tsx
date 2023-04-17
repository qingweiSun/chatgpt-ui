import Slider from "@/app/components/slider";
import styles from "./home.module.css";
import ChatView from "@/app/pages/chat";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.slider}>
        <Slider />
      </div>
      <div style={{ width: 300 }} className={styles.slider} />
      <div
        className={styles.slider}
        style={{ width: 1, height: "100vh", background: "#eeeeee", zIndex: 10 }}
      />
      <ChatView />
    </div>
  );
}
