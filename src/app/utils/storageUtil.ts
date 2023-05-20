//常量
export const Constants = {
  token: "token",
  ano: "ano",
  hasLastPrompt: "hasLastPrompt",
  baseUrl: process.env.host,
  historyList: "historyList",
};

const storageUtil = {
  get(key: string): any {
    return window.localStorage.getItem(key);
  },
  set(key: string, value: any): void {
    window.localStorage.setItem(key, value);
  },
  remove(key: string): void {
    window.localStorage.removeItem(key);
  },
};
export default storageUtil;
