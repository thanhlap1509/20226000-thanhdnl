import moment from "moment";
const strToDate = (dateStr) => {
  const date = dateStr ? moment(dateStr) : null;
  return date;
};

export default strToDate;
