import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { Button } from "@nextui-org/react";
import { ArrowDown, ArrowUp, Delete, Edit, Plus, Setting } from "react-iconly";
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
  top: boolean;
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
          title: "新的会话1",
          id: 1,
          top: false,
        },
      ]);
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 12,
        }}
      >
        {historyList[propsItem.index - 1]?.top &&
          !(historyList[propsItem.index]?.top ?? false) && (
            <div style={{ marginLeft: 16, color: "#666666", fontSize: 12 }}>
              其他会话
            </div>
          )}

        {propsItem.index == 0 &&
          (historyList[propsItem.index]?.top ?? false) && (
            <div style={{ marginLeft: 16, color: "#666666", fontSize: 12 }}>
              置顶会话
            </div>
          )}

        {propsItem.index == 0 &&
          !(historyList[propsItem.index]?.top ?? false) && (
            <div style={{ marginLeft: 16, color: "#666666", fontSize: 12 }}>
              全部会话
            </div>
          )}
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
            if (current.id == propsItem.item.id) {
              if (newList.length == 0) {
                setHistoryList([]);
                setId({
                  id: 1,
                  name: "新的会话1",
                });
                return;
              }
              if (propsItem.index == 0) {
                setHistoryList(
                  newList.map((item, i) => {
                    return {
                      ...item,
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
          isTop={propsItem.item.top}
          onTop={() => {
            setHistoryList(
              historyList.map((item, i) => {
                return {
                  ...item,
                  top: item.id == propsItem.item.id ? !item.top : item.top,
                };
              })
            );
          }}
        />
      </div>
    );
  }

  const MenuListView = useMemo(() => {
    return (
      <Fragment>
        {historyList
          .sort((a, b) => {
            return b.id - a.id;
          })
          .sort((i) => {
            return i.top ? -1 : 1;
          })
          .map((item, index) => {
            return <ItemView item={item} index={index} key={index} showEdit />;
          })}
      </Fragment>
    );
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
        <ItemView
          item={{
            title: "随便聊聊",
            id: 10000,
            top: false,
          }}
          index={10000}
          showEdit={false}
          onClick={() => {
            setId({ id: 10000, name: "随便聊聊" });
            props.closeSlider?.();
          }}
        />
        {MenuListView}
        <SelectButtonView
          onDelete={() => {
            setHistoryList([]);
            //获取全部localStorage的key
            const keys = Object.keys(localStorage);
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
            setId({
              id: 1,
              name: "新的会话1",
            });
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
              background: "rgba(255,255,255,0.4)",
            },
          }}
          onClick={() => {
            //获取historyListid最大的
            const sortList = historyList.sort((item1, item2) => {
              return item2.id - item1.id;
            });
            console.log(sortList);
            const newId = sortList[0].id + 1;
            setHistoryList([
              {
                title: "新的会话" + newId,
                id: newId,
                top: false,
              },
              ...historyList.map((item) => {
                return {
                  ...item,
                  selected: false,
                };
              }),
            ]);
            setId({ id: newId, name: "新的会话" + newId });
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
  isTop: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  onTop: () => void;
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
        {props.showEdit && (
          <div
            className={`${styles.operate} ${
              !props.current ? styles.hide : undefined
            }`}
          >
            <Button
              light
              auto
              css={{
                height: "auto",
                padding: 0,
                color: props.current
                  ? "var(--nextui-colors-primary)"
                  : "#444444",
              }}
              className={styles.delete}
              onClick={() => {
                props.onTop();
              }}
            >
              {props.isTop ? (
                <ArrowDown set="curved" size={18} />
              ) : (
                <ArrowUp set="curved" size={18} />
              )}
            </Button>
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

        {/* {props.isTop && (
          <div
            className={styles.top}
            style={{
              position: "absolute",
              right: 4,
              top: 4,
            }}
          />
        )} */}
      </div>
    </Button>
  );
}
