import { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import { Button } from "@nextui-org/react";
import { Delete, Edit, Plus, Setting } from "react-iconly";
import Image from "next/image";
import ChatGptLogo from "../../icons/chatgpt.svg";
import IdContext from "@/app/hooks/use-chat-id";
import { useRouter } from "next/navigation";
import { SelectView } from "@/app/components/delete-view";
import EditName from "@/app/components/edit-name";
import SettingModal from "@/app/components/setting";
import RewardView from "@/app/components/Reward";

//https://react-iconly.jrgarciadev.com/ 图标

export interface HistoryItem {
  title: string;
  id: number;
  selected: boolean;
}

export default function Slider(props: {
  isMobile?: boolean;
  closeSlider?: () => void;
}) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>(
    JSON.parse(localStorage.getItem("historyList") || "[]")
  );
  const { current, setId } = useContext(IdContext);
  const router = useRouter();

  useEffect(() => {
    const newList = historyList.map((item) => {
      if (item.id == current.id) {
        item.title = current.name;
      }
      return item;
    });
    setHistoryList(newList);
  }, [current.name]);
  useEffect(() => {
    if (historyList.length == 0) {
      setHistoryList([
        {
          title: "新的会话",
          id: 1,
          selected: true,
        },
      ]);
      //router.replace("/?id=1");
      setId({ id: 1, name: "新的会话" });
    } else {
      const item = historyList.find((item) => item.selected);
      if (item) {
        // router.replace("/?id=" + item.id);
        setId({ id: item.id, name: item.title });
      }
    }
    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [historyList]);

  return (
    <div className={`${styles.slider}`}>
      <div
        style={{
          position: "absolute",
          left: -10,
          top: -10,
          overflow: "hidden",
        }}
      >
        <Image src={ChatGptLogo} alt={"logo"} />
      </div>
      <div
        style={{
          padding: "16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ height: 16 }} />
        <div className={styles.title}>ChatGPT</div>
        <div className={styles.sub}>Based on OpenAI API (gpt-3.5-turbo).</div>
      </div>
      <div
        style={{
          overflowY: "scroll",
          gap: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {historyList.map((item, index) => {
          return (
            <HistoryItemView
              key={index}
              title={item.title}
              current={item.selected}
              onClick={() => {
                setHistoryList(
                  historyList.map((item, i) => {
                    return {
                      ...item,
                      selected: i == index,
                    };
                  })
                );
                props.closeSlider?.();
              }}
              onRename={(name) => {
                setId({ id: item.id, name: name });
                props.closeSlider?.();
              }}
              onDelete={() => {
                const newList = historyList.filter((_, i) => i != index);
                localStorage.removeItem("historyList" + item.id);
                if (item.selected) {
                  if (newList.length == 0) {
                    setHistoryList([]);
                    return;
                  }
                  if (index == 0) {
                    setHistoryList(
                      newList.map((item, i) => {
                        return {
                          ...item,
                          selected: i == 0,
                        };
                      })
                    );
                  } else {
                    setHistoryList(
                      newList.map((item, i) => {
                        return {
                          ...item,
                          selected: i == index - 1,
                        };
                      })
                    );
                  }
                } else {
                  setHistoryList(newList);
                }
              }}
            />
          );
        })}
        <div style={{ height: 76, width: "100%", flex: "0 0 auto" }} />
      </div>
      <div className={styles.bottom}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SettingModal>
            <Setting set="two-tone" size={22} />
          </SettingModal>
          <RewardView />
        </div>
        <Button
          auto
          bordered
          borderWeight={"light"}
          css={{
            flex: "0 0 auto",
            "&:hover": {
              background: "#ffffff",
            },
          }}
          onClick={() => {
            const newId = historyList[0].id + 1;
            setHistoryList([
              {
                title: "新的会话",
                id: newId,
                selected: true,
              },
              ...historyList.map((item) => {
                return {
                  ...item,
                  selected: false,
                };
              }),
            ]);
            props.closeSlider?.();
          }}
        >
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div>新建会话</div>
            <Plus set="curved" size={18} />
          </div>
        </Button>
      </div>
    </div>
  );
}

function HistoryItemView(props: {
  title: string;
  current: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  return (
    <Button
      bordered
      className={styles.historyItem}
      color="primary"
      css={{
        color: props.current ? undefined : "#696969",
        borderWidth: 1,
        margin: "0 12px",
        fontWeight: props.current ? 500 : 400,
        flex: "0 0 auto",
        justifyContent: "start",
        backdropFilter: "blur(4px)",
        display: "unset",
        background: props.current ? "rgba(255,255,255,0.4)" : undefined,
        borderStyle: props.current ? undefined : "dashed",
        borderColor: props.current ? undefined : "#bfbfbf",
        "&:hover": {
          borderColor: "var(--nextui-colors-primary)",
        },
      }}
      onPress={props.onClick}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/*<Chat set="curved" />*/}
        <div
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "100%",
            textAlign: "left",
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </div>
        <div
          className={`${styles.operate} ${
            !props.current ? styles.hide : undefined
          }`}
        >
          <EditName
            setName={props.onRename}
            name={props.title}
            className={styles.delete}
          >
            <Edit set="curved" size={18} />
          </EditName>
          <SelectView
            placement={"bottom-right"}
            onDelete={props.onDelete}
            title={"提示"}
            description={"确定要删除这个会话吗？"}
          >
            <Delete set="curved" size={18} />
          </SelectView>
        </div>
      </div>
    </Button>
  );
}
