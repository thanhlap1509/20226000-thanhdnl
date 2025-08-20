const strToDate = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : null;
  return date;
};

module.exports = strToDate;
