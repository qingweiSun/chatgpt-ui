import Slider from "@/app/components/slider";
import styles from "./home.module.css";
import {useEffect, useState} from "react";
import ChatView from "@/app/pages/chat";

export default function Home() {

  return (
    <div className={styles.home}>
      <Slider />
      <div style={{ width: 300 }} />
      <div
        style={{ width: 1, height: "100vh", background: "#eeeeee", zIndex: 10 }}
      />
      <ChatView />
    </div>
  );
}
