// db.ts
import Dexie, { Table } from "dexie";
import { HistoryItem } from "../components/slider";
import { MaxTokensLimitProps } from "../components/max-tokens-limit";
export class MyAiDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  sliders!: Table<HistoryItem>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      sliders: "++id,title,top,mode", // Primary key and indexed props
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

export async function updateSliderExplain(id: number, explain: boolean) {
  await db.sliders?.update(id, { explain: explain });
}
export async function deleteSlider(id: number) {
  await db.sliders?.delete(id);
}

export async function clearSlider() {
  await db.sliders?.where("id").notEqual(1).delete();
}
export async function getSliderMaxId() {
  const count = await db.sliders?.count();
  if (count > 0) {
    const maxList = await db.sliders.orderBy("id").reverse().limit(1).toArray();
    return maxList[0].id;
  } else {
    return 0;
  }
}
