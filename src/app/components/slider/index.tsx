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
import { Dropdown, MenuProps } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import Image from "next/image";
import { Fragment, useContext, useEffect, useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  Chat,
  Delete,
  Edit,
  EditSquare,
  Plus,
  Setting,
} from "react-iconly";
import { useMediaQuery } from "react-responsive";
import ChatGptLogo from "../../icons/chatgpt.svg";
import { MaxTokensLimitProps } from "../max-tokens-limit";
import ThemeChangeView from "../theme-change";
import styles from "./index.module.css";
import { on } from "events";
import { copyToClipboard } from "@/app/pages/chat/markdown-text";
import { toast } from "react-hot-toast";

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
  const isDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
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
    icon?: React.ReactNode;
  }) {
    return (
      <Fragment>
        {historyList &&
          propsItem.item.id != 1 &&
          propsItem.item.id != 2 &&
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
          id={propsItem.item.id}
          isDarkMode={isDarkMode}
          showEdit={propsItem.showEdit}
          key={propsItem.index}
          title={propsItem.item.title}
          current={current.id == propsItem.item.id}
          icon={propsItem.icon}
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
            localStorage.removeItem("historyList" + propsItem.item.id);
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
      </Fragment>
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
        return (
          <ItemView
            item={item}
            index={index}
            key={item.id}
            showEdit
            // icon=<Chat set="curved" size={16} style={{ flexShrink: 0 }} />
          />
        );
      });
  }, [historyList, current, isDarkMode]);

  return (
    <div className={`${styles.slider}`}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          height: "100%",
          overflowY: "scroll",
        }}
      >
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
              style={{ opacity: isDarkMode ? 0.1 : 0.8 }}
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
            <div className={styles.sub}>
              Based on OpenAI API (gpt-3.5-turbo).
            </div>
          </div>
        </div>
        <ItemView
          item={{
            title: "随便聊聊",
            id: 1,
            top: false,
          }}
          index={1}
          showEdit={false}
          icon=<Chat set="curved" size={16} style={{ flexShrink: 0 }} />
          onClick={() => {
            setId({ id: 1 });
            props.closeSlider?.();
          }}
        />
        <ItemView
          item={{
            title: "随便记记",
            id: 2,
            top: false,
          }}
          index={1}
          icon=<EditSquare set="curved" size={16} style={{ flexShrink: 0 }} />
          showEdit={false}
          onClick={() => {
            setId({ id: 2 });
            props.closeSlider?.();
          }}
        />
        {sliderList}
        {(historyList?.length ?? 0) > 0 && (
          <div
            className={styles.clear}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              bottom: 0,
            }}
          >
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
              placement="top-right"
              description="清理后无法找回，数据无价，请注意保存！"
            />
            <div style={{ color: "transparent", height: 72 }}></div>
          </div>
        )}
      </div>
      <div className={styles.bottom}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <SettingModal>
            <Setting set="two-tone" size={22} />
          </SettingModal>
          <ThemeChangeView />
        </div>
        <Button
          auto
          bordered
          borderWeight={"light"}
          css={{
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

function getMenus(
  id: number,
  isTop: boolean,
  onTop: () => void,
  onDelete: () => void,
  title: string
): MenuProps["items"] | undefined {
  switch (id) {
    case 1:
      return [];
    case 2:
      return [];
    default:
      const unTop = {
        label: " 取消置顶",
        key: "3",
        onClick: () => onTop(),
      };

      const top = {
        label: "置顶",
        key: "4",
        onClick: () => onTop(),
      };

      // const copyName = {
      //   label: "复制会话名称",
      //   key: "7",
      //   onClick: () => {
      //     copyToClipboard(title);
      //   },
      // };

      const copyContent = {
        label: "复制会话内容",
        key: "8",
        onClick: () => {
          copyToClipboard(localStorage.getItem("historyList" + id) ?? "");
        },
      };
      const deleteItem = {
        label: <div style={{ color: "var(--nextui-colors-error)" }}>删除</div>,
        key: "5",
        onClick: () => onDelete(),
      };

      return isTop
        ? [unTop, copyContent, { type: "divider" }, deleteItem]
        : [top, copyContent, { type: "divider" }, deleteItem];
  }
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
  id: number;
  icon?: React.ReactNode;
}) {
  return (
    <Dropdown
      dropdownRender={(menu) => {
        return props.id < 1000 ? <div /> : menu;
      }}
      overlayStyle={{
        border: props.isDarkMode
          ? "1px solid rgba(57, 58, 60, 1)"
          : "1px solid #eeeeee",
        borderRadius: 12,
      }}
      menu={{
        items: getMenus(
          props.id,
          props.isTop,
          props.onTop,
          props.onDelete,
          props.title
        ),
      }}
      trigger={["contextMenu"]}
    >
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
            : "#444444",
          borderWidth: 1,
          lineHeight: "unset !important",
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
          {props.icon}
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
              {/* <Button
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
              </Button> */}
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
    </Dropdown>
  );
}
