import moment from "moment";
const s = new moment();
setTimeout(() => {
  const e = new moment();
  console.log(s, e, e - s);
}, 2000);
