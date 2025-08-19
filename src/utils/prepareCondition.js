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
    if (filterObj[fieldName]) {
      const error = new CustomError(errorCode.BAD_REQUEST);
      error.details = `Duplicate field ${fieldName}`;
      throw error;
    } else {
      filterObj[fieldName] = sortOrder.localeCompare("+") === 0 ? 1 : -1;
    }
  }
  return filterObj;
};

module.exports = prepareSortCondition;
