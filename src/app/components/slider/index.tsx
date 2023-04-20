import { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import { Button } from "@nextui-org/react";
import { Delete, Edit, Plus, Setting } from "react-iconly";
import Image from "next/image";
import ChatGptLogo from "../../icons/chatgpt.svg";
import IdContext from "@/app/hooks/use-chat-id";
import { useRouter } from "next/navigation";
import {
  DeleteView,
  SelectButtonView,
  SelectView,
} from "@/app/components/delete-view";
import EditName from "@/app/components/edit-name";
import SettingModal from "@/app/components/setting";
import RewardView from "@/app/components/Reward";
import { toast } from "react-hot-toast";

//https://react-iconly.jrgarciadev.com/ 图标

export interface HistoryItem {
  title: string;
  id: number;
  selected: boolean;
  collect: boolean;
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
          collect: false,
        },
      ]);
      //router.replace("/?id=1");
      // if (current.id != 10000) {
      //   setId({ id: 1, name: "新的会话" });
      // }
    } else {
      const item = historyList.find((item) => item.selected);
      if (item) {
        // router.replace("/?id=" + item.id);
        // if (current.id != 10000) {
        //   setId({ id: item.id, name: item.title });
        // }
      }
    }

    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [historyList]);

  function ItemView(propsItem: {
    item: HistoryItem;
    index: number;
    showEdit: boolean;
    onClick?: () => void;
  }) {
    return (
      <HistoryItemView
        showEdit={propsItem.showEdit}
        key={propsItem.index}
        title={propsItem.item.title}
        current={current.id == propsItem.item.id}
        onClick={() => {
          if (propsItem.onClick) {
            propsItem.onClick();
          } else {
            setId({ id: propsItem.item.id, name: propsItem.item.title });
            setHistoryList(
              historyList.map((item, i) => {
                return {
                  ...item,
                  selected: item.id == propsItem.item.id,
                };
              })
            );
            props.closeSlider?.();
          }
        }}
        onRename={(name) => {
          setId({ id: propsItem.item.id, name: name });
          props.closeSlider?.();
        }}
        onDelete={() => {
          const newList = historyList.filter((_, i) => i != propsItem.index);
          localStorage.removeItem("historyList" + propsItem.item.id);
          if (propsItem.item.selected) {
            if (newList.length == 0) {
              setHistoryList([]);
              setId({
                id: 1,
                name: "新的会话",
              });
              return;
            }
            if (propsItem.index == 0) {
              setHistoryList(
                newList.map((item, i) => {
                  return {
                    ...item,
                    selected: i == 0,
                  };
                })
              );
              setId({
                id: newList[0].id,
                name: newList[0].title,
              });
            } else {
              setHistoryList(
                newList.map((item, i) => {
                  return {
                    ...item,
                    selected: i == propsItem.index - 1,
                  };
                })
              );
              setId({
                id: newList[propsItem.index - 1].id,
                name: newList[propsItem.index - 1].title,
              });
            }
          } else {
            setHistoryList(newList);
          }
        }}
      />
    );
  }
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
        <ItemView
          item={{
            title: "随便聊聊",
            id: 10000,
            selected: current.id == 10000,
            collect: false,
          }}
          index={10000}
          showEdit={false}
          onClick={() => {
            localStorage.setItem("historyList" + 2, JSON.stringify([]));
            setId({ id: 10000, name: "随便聊聊" });
            props.closeSlider?.();
          }}
        />
        <div style={{ marginLeft: 16, color: "#999999", fontSize: 12 }}>
          全部会话
        </div>
        {historyList.map((item, index) => {
          return <ItemView item={item} index={index} key={index} showEdit />;
        })}
        <SelectButtonView
          onDelete={() => {
            setHistoryList([]);
            //获取全部localStorage的key
            var keys = Object.keys(localStorage);
            //遍历key
            for (var i = 0; i < keys.length; i++) {
              //如果key以historyList开头或者以questioningMode开头
              if (
                keys[i].indexOf("historyList") == 0 ||
                keys[i].indexOf("questioningMode") == 0
              ) {
                //删除该key
                localStorage.removeItem(keys[i]);
              }
            }
          }}
          title="警告"
          description="清理后无法找回，数据无价，请注意保存！"
        />
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
            setId({ id: 1, name: "新的会话" });
            setHistoryList([
              {
                title: "新的会话",
                id: newId,
                selected: true,
                collect: false,
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
  showEdit: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  console.log(props);
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
        {props.showEdit && (
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
        )}
      </div>
    </Button>
  );
}
