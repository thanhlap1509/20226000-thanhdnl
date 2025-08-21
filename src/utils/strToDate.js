const moment = require("moment");
const strToDate = (dateStr) => {
  const date = dateStr ? moment(dateStr) : null;
  return date;
};

module.exports = strToDate;
