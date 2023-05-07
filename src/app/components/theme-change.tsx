import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import RewardView from "./Reward";
import { Button } from "antd";
import styles from "./delete.module.css";
import { Dropdown } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import ThemeIcon from "../icons/dark-mode-svgrepo-com.svg";
import Image from "next/image";
import { Category, Graph, TimeCircle, TimeSquare } from "react-iconly";
import { DarkIcon } from "../icons/theme-iocn";
export default function ThemeChangeView() {
  const [isElectron, setIsElectron] = useState(
    typeof navigator !== "undefined" &&
      navigator.userAgent.indexOf("Electron") !== -1
  );
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

  const [darkMode, setDarkMode] = useState("system");

  async function refreshDarkMode() {
    const electron = window.require("electron");
    const darkMode = await electron.ipcRenderer.invoke("dark-mode");
    setDarkMode(darkMode);
  }
  useEffect(() => {
    if (isElectron) {
      refreshDarkMode();
    }
  }, []);
  const data = [
    {
      value: "dark",
      desc: "夜间模式",
    },
    {
      value: "light",
      desc: "白天模式",
    },
    {
      value: "system",
      desc: " 跟随系统",
    },
  ];
  return !isElectron ? (
    <Dropdown placement="top-left" isBordered>
      <Dropdown.Trigger
        css={{
          background: isDarkMode ? "#1b1b1b" : "var(--nextui-colors-accents1)",
          color: isDarkMode ? "#cccccc" : "#444444",
          "&:hover": {
            color: "var(--nextui-colors-primary)",
            // background: "#b7d5f8",
          },
        }}
      >
        <Button className={styles.link} type={"link"} style={{ fontSize: 15 }}>
          {/* <TimeCircle set="two-tone" /> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 1,
              justifyContent: "center",
            }}
          >
            <DarkIcon />
          </div>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu
        aria-label="Single selection actions"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[darkMode]}
        onSelectionChange={async (value) => {
          //@ts-ignore
          const key = value.currentKey;
          const select = data.find((item) => item.value == key);
          if (select) {
            try {
              const electron = window.require("electron");
              switch (select.value) {
                case "dark":
                  electron.ipcRenderer.invoke("dark-mode:dark");
                  toast.success("已开启夜间模式");
                  break;
                case "light":
                  electron.ipcRenderer.invoke("dark-mode:light");
                  toast.success("已开启白天模式");
                  break;
                default:
                  electron.ipcRenderer.invoke("dark-mode:system");
                  toast.success("已跟随系统");
                  break;
              }
            } catch (e) {
              console.error(e);
            } finally {
              refreshDarkMode();
            }
          }
        }}
      >
        {data.map((item) => {
          return (
            <Dropdown.Item
              key={item.value}
              css={{
                height: "auto",
                color: isDarkMode ? "#cccccc" : undefined,
              }}
            >
              <div
                style={{
                  padding: 8,
                  gap: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {item.desc}
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <RewardView />
  );
}
