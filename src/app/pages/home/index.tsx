import Slider from "@/app/components/slider";
import styles from "./home.module.css";
import ChatView from "@/app/pages/chat";
import { useContext } from "react";
import { context } from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";

export default function Home() {
  const { isMobile } = useContext(context);
  const { mode, setMode } = useContext(AppContext);

  return (
    <div
      className={`${styles.container} ${
        mode == "card" ? styles.cardMode : undefined
      }`}
    >
      <div
        className={`${styles.home} ${
          mode == "card" ? styles.cardModeContent : undefined
        }`}
      >
        {!isMobile && (
          <div className={styles.slider}>
            <Slider />
          </div>
        )}
        {!isMobile && <div style={{ width: 300 }} className={styles.slider} />}
        <div
          className={styles.slider}
          style={{
            width: 1,
            height: "100%",
            background: "#eeeeee",
            zIndex: 10,
          }}
        />
        <ChatView />
      </div>
    </div>
  );
}
