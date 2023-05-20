// db.ts
import Dexie, { Table } from "dexie";
import { HistoryItem } from "../components/slider";
import { MaxTokensLimitProps } from "../components/max-tokens-limit";
import { ChatMessage } from "../pages/chat";

export interface TemplateItem {
  id?: number;
  message: ChatMessage;
}
export class MyAiDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  sliders!: Table<HistoryItem>;
  templates!: Table<TemplateItem>;

  constructor() {
    super("myDatabase");
    this.version(4).stores({
      sliders: "++id,title,top,mode,openNetwork,model", // Primary key and indexed props
      templates: "++id,message",
    });
  }
}

export const db = new MyAiDexie();

export async function insertSlider(item: HistoryItem) {
  await db.sliders?.add(item);
}
export async function updateSlider(item: HistoryItem) {
  await db.sliders?.update(item.id, item);
}

//根据 id 更新mode
export async function updateSliderMode(id: number, mode: MaxTokensLimitProps) {
  await db.sliders?.update(id, { mode: mode });
}

//根据 id更新 title
export async function updateSliderTitle(id: number, title: string) {
  await db.sliders?.update(id, { title: title });
}
//根据 id 更新openNetwork
export async function updateSliderOpenNetwork(
  id: number,
  openNetwork: boolean
) {
  await db.sliders?.update(id, { openNetwork: openNetwork });
}
//根据 id 更新model
export async function updateSliderModel(
  id: number,
  model: "gpt-3.5-turbo" | "gpt-4"
) {
  await db.sliders?.update(id, { model: model });
}
//根据 id 判断是否存在
export async function isExist(id: number): Promise<boolean> {
  const count = await db.sliders?.where("id").equals(id).count();
  return count > 0;
}

export async function updateSliderExplain(id: number, explain: boolean) {
  await db.sliders?.update(id, { explain: explain });
}
export async function deleteSlider(id: number) {
  await db.sliders?.delete(id);
}

export async function clearSlider() {
  //全部删除并插入默认数据
  await db.transaction("rw", db.sliders, async () => {
    await db.sliders?.where("id").notEqual(1).delete();
    await db.sliders?.put({
      title: "新的会话10000",
      id: 10000,
      top: false,
      explain: (localStorage.getItem("defaultMode") ?? "default") == "default",
    });
  });
}
export async function getSliderMaxId() {
  const count = await db.sliders?.count();
  if (count > 0) {
    const maxList = await db.sliders.orderBy("id").reverse().limit(1).toArray();
    const maxId = maxList[0].id;
    if (maxId < 9999) {
      return 9999;
    } else {
      return maxId;
    }
  } else {
    return 9999;
  }
}
