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
      return `${hour}:${minute}`;
    } else if (year === nowYear) {
      return `${month}/${day} ${hour}:${minute}`;
    } else {
      return `${year}/${month}/${day} ${hour}:${minute}`;
    }
  },
};
