export const util = {
  getDateFormat(date: string): string {
    //如果是今天则返回时分，如果是今年则返回月日时分，否则返回年月日时分
    let now = new Date();
    let dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth() + 1;
    let nowDay = now.getDate();
    if (year === nowYear && month === nowMonth && day === nowDay) {
      return `${this.addZero(hour)}:${this.addZero(minute)}`;
    } else if (year === nowYear) {
      return `${this.addZero(month)}/${this.addZero(day)} ${this.addZero(
        hour
      )}:${this.addZero(minute)}`;
    } else {
      return `${year}/${this.addZero(month)}/${this.addZero(
        day
      )} ${this.addZero(hour)}:${this.addZero(minute)}`;
    }
  },
  //小于 10 的数字前面加 0
  addZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  },
  //host: process.env.NEXT_PUBLIC_HOST_URL ?? "https://ai.qingwei.site",
  host: "",
};
