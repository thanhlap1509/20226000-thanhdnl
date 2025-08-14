const { userFields } = require("../models/user");
const binarySearch = require("./searchIndex");

const prepareSortCondition = (condition) => {
  const fields = condition.split(",");
  const filterObj = {};

  let field;
  let fieldName;
  let sortOrder;
  for (const idx in fields) {
    field = fields[idx];
    fieldName = field.substring(1);
    sortOrder = field[0];
    if (sortOrder.localeCompare("+") === 0 || sortOrder.localeCompare("-") === 0) {
      if (binarySearch(userFields, fieldName, (a, b) => a.localeCompare(b)) !== -1) {
        filterObj[fieldName] = sortOrder.localeCompare("+") === 0 ? 1 : -1;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return filterObj;
};

module.exports = prepareSortCondition;
