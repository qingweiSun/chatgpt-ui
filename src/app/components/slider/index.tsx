import RewardView from "@/app/components/Reward";
import { SelectButtonView, SelectView } from "@/app/components/delete-view";
import EditName from "@/app/components/edit-name";
import SettingModal from "@/app/components/setting";
import {
  clearSlider,
  db,
  deleteSlider,
  getSliderMaxId,
  insertSlider,
  updateSlider,
} from "@/app/db/db";
import IdContext from "@/app/hooks/use-chat-id";
import { Button } from "@nextui-org/react";
import { useLiveQuery } from "dexie-react-hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Delete,
  Edit,
  Image2,
  Plus,
  Setting,
} from "react-iconly";
import ChatGptLogo from "../../icons/chatgpt.svg";
import styles from "./index.module.css";
import { MaxTokensLimitProps } from "../max-tokens-limit";
import { toast } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import { Scrollbars } from "replace-custom-scrollbars";

//https://react-iconly.jrgarciadev.com/ 图标
//https://dexie.org/docs/Tutorial/React 数据库
export interface HistoryItem {
  title: string;
  id: number;
  top: boolean;
  mode?: MaxTokensLimitProps;
  explain?: boolean;
}

export default function Slider(props: {
  isMobile?: boolean;
  closeSlider?: () => void;
}) {
  const historyList = useLiveQuery(() =>
    db.sliders.where("id").notEqual(1).toArray()
  );
  const { current, setId } = useContext(IdContext);
  const router = useRouter();
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const [scrollTop, setScrollTop] = useState(0);
  // useEffect(() => {
  //   db.table("sliders").hook("deleting", function (primaryKey, obj) {
  //     toast("删除");
  //   });
  // }, []);
  useEffect(() => {
    if (historyList) {
      if (historyList.length == 0) {
        insertSlider({
          id: 1000,
          title: "新的会话1000",
          top: false,
        });
        setId({ id: 1000 });
      }
    }
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
        {historyList &&
          propsItem.item.id != 1 &&
          historyList[propsItem.index - 1]?.top &&
          !(historyList[propsItem.index]?.top ?? false) && (
            <div className={styles.label}>其他会话</div>
          )}

        {propsItem.index == 0 &&
          historyList &&
          (historyList[propsItem.index]?.top ?? false) && (
            <div className={styles.label}>置顶会话</div>
          )}

        {propsItem.index == 0 &&
          historyList &&
          !(historyList[propsItem.index]?.top ?? false) && (
            <div className={styles.label}>全部会话</div>
          )}
        <HistoryItemView
          isDarkMode={isDarkMode}
          showEdit={propsItem.showEdit}
          key={propsItem.index}
          title={propsItem.item.title}
          current={current.id == propsItem.item.id}
          onClick={() => {
            if (propsItem.onClick) {
              propsItem.onClick();
            } else {
              setId({ id: propsItem.item.id });
              props.closeSlider?.();
            }
          }}
          onRename={(name) => {
            setId({ id: propsItem.item.id });
            props.closeSlider?.();
          }}
          onDelete={async () => {
            await deleteSlider(propsItem.item.id);
            //从 historyList 中删除 获得临时数据
            const tempList = historyList?.filter(
              (_, i) => i != propsItem.index
            );
            if (tempList) {
              if (tempList.length > 0) {
                if (tempList.length > propsItem.index) {
                  //首先判断删除的是不是current，如果不是，则不需要定位，如果是，则需要定位到下一个
                  if (current.id == propsItem.item.id) {
                    //定位到当前的下一个
                    setId({
                      id: tempList[propsItem.index].id,
                    });
                  }
                } else {
                  setId({
                    id: tempList[tempList.length - 1].id,
                  });
                }
              }
            }
          }}
          isTop={propsItem.item.top}
          onTop={() => {
            updateSlider({
              id: propsItem.item.id,
              title: propsItem.item.title,
              top: !propsItem.item.top,
            });
          }}
        />
      </div>
    );
  }

  const sliderList = useMemo(() => {
    return historyList
      ?.sort((a, b) => {
        return b.id - a.id;
      })
      .sort((i) => {
        return i.top ? -1 : 1;
      })
      .map((item, index) => {
        return <ItemView item={item} index={index} key={item.id} showEdit />;
      });
  }, [historyList, current, isDarkMode]);

  return (
    <div className={`${styles.slider}`}>
      <div className={styles.head}>
        <div
          style={{
            position: "absolute",
            left: -10,
            top: -10,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <Image
            src={ChatGptLogo}
            alt={"logo"}
            style={{ opacity: isDarkMode ? 0.1 : 0.6 }}
          />
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
      </div>
      <Scrollbars>
        <div
          style={{
            gap: 12,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: 90, width: "100%" }} />
          <ItemView
            item={{
              title: "随便聊聊",
              id: 1,
              top: false,
            }}
            index={1}
            showEdit={false}
            onClick={() => {
              setId({ id: 1 });
              props.closeSlider?.();
            }}
          />
          {sliderList}
          {(historyList?.length ?? 0) > 0 && (
            <SelectButtonView
              onDelete={() => {
                clearSlider();
                //获取全部localStorage的key
                const keys = Object.keys(localStorage);
                //遍历key
                for (var i = 0; i < keys.length; i++) {
                  //如果key以historyList开头或者以questioningMode开头
                  if (keys[i].indexOf("historyList") == 0) {
                    //删除该key
                    localStorage.removeItem(keys[i]);
                  }
                }
              }}
              title="警告"
              description="清理后无法找回，数据无价，请注意保存！"
            />
          )}
          <div style={{ height: 76, width: "100%", flex: "0 0 auto" }} />
        </div>
      </Scrollbars>
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
              background: isDarkMode
                ? "rgba(15, 50, 107,0.4)"
                : "rgba(255,255,255,0.4)",
            },
          }}
          onClick={async () => {
            //获取historyListid最大的
            const newId = (await getSliderMaxId()) + 1;
            insertSlider({
              title: "新的会话" + newId,
              id: newId,
              top: false,
              explain:
                (localStorage.getItem("defaultMode") ?? "default") == "default",
            });
            setId({ id: newId });
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
  isDarkMode: boolean;
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
        color: props.current
          ? props.isDarkMode
            ? "#cccccc"
            : undefined
          : props.isDarkMode
          ? "#999999"
          : "#696969",
        borderWidth: 1,
        margin: "0 12px",
        fontWeight: props.current ? 500 : 400,
        flex: "0 0 auto",
        justifyContent: "start",
        backdropFilter: "blur(4px)",
        display: "unset",
        background: props.current
          ? props.isDarkMode
            ? "rgba(15, 50, 107,0.6)"
            : "rgba(255,255,255,0.4)"
          : undefined,
        borderStyle: props.current ? undefined : "dashed",
        borderColor: props.current
          ? undefined
          : props.isDarkMode
          ? "#444444"
          : "#bfbfbf",
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
                  ? props.isDarkMode
                    ? "#cccccc"
                    : "var(--nextui-colors-primary)"
                  : props.isDarkMode
                  ? "#999999"
                  : "#696969",
              }}
              className={props.current ? styles.current : styles.delete}
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
              className={props.current ? styles.current : styles.delete}
            >
              <Edit set="curved" size={18} />
            </EditName>
            <SelectView
              className={props.current ? styles.current : styles.delete}
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
