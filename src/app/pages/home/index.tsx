import Slider from "@/app/components/slider";
import styles from "./home.module.css";
import ChatView from "@/app/pages/chat";
import { useContext } from "react";
import { context } from "@/app/hooks/context-mobile";
import AppContext from "@/app/hooks/use-style";
import IdContext from "@/app/hooks/use-chat-id";

export default function Home() {
  const { isMobile } = useContext(context);
  const { mode, setMode } = useContext(AppContext);
  const { current, setId } = useContext(IdContext);
  const cardStyle = () => {
    switch (mode.size) {
      case "small":
        return styles.cardModeSmall;
      case "middle":
        return styles.cardModeMedium;
      case "large":
        return styles.cardModeLarge;
      default:
        return styles.cardModeMedium;
    }
  };

  return (
    <div
      className={`${styles.container} ${
        mode.mode != "normal" || isMobile ? cardStyle() : undefined
      }`}
    >
      <div
        className={`${styles.home} ${
          mode.mode != "normal" || isMobile ? styles.cardModeContent : undefined
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
        {current.id > 0 && <ChatView />}
      </div>
    </div>
  );
}
