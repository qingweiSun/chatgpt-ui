import Slider from "@/app/components/slider";
import styles from "./home.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatView from "@/app/pages/chat";

export default function Home() {
  const router = useRouter();
  const [id, setId] = useState<number>();
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setId(+id);
    }
  }, []);
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
