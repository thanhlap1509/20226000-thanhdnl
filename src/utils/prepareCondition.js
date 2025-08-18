const { userFields } = require("../models/user");
const binarySearch = require("./searchIndex");
const { CustomError, errorCode } = require("../error");

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
    if (
      (sortOrder.localeCompare("+") === 0 ||
        sortOrder.localeCompare("-") === 0) &&
      binarySearch(userFields, fieldName, (a, b) => a.localeCompare(b)) !== -1
    ) {
      filterObj[fieldName] = sortOrder.localeCompare("+") === 0 ? 1 : -1;
    } else {
      const error = new CustomError(errorCode.BAD_REQUEST);
      error.details = "/sort_by/ must be +/- follow by a valid user field";
      throw error;
    }
  }
  return filterObj;
};

module.exports = prepareSortCondition;
