import Slider from "@/app/components/slider";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import ChatView from "@/app/pages/chat";
import toast from "react-hot-toast";

export default function Home() {
  const [id, setId] = useState<number>();
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setId(+id);
    }
  }, [window.location.search]);
  return (
    <div className={styles.home}>
      <Slider />
      <div style={{ width: 300 }} />
      <div
        style={{ width: 1, height: "100vh", background: "#eeeeee", zIndex: 10 }}
      />
      <ChatView id={id} />
    </div>
  );
}
