import { BAD_REQUEST } from "../error/code.js";
import CustomError from "../error/customError.js";
const prepareSortCondition = (condition) => {
  const fields = condition.split(",");
  const filterObj = {};

  let field;
  let fieldName;
  let sortOrder;
  for (const idx in fields) {
    field = fields[idx];
    [fieldName, sortOrder] = field.split(".");
    if (filterObj[fieldName]) {
      const error = new CustomError(BAD_REQUEST);
      error.details = `Duplicate field ${fieldName}`;
      throw error;
    } else {
      filterObj[fieldName] = sortOrder.localeCompare("asc") === 0 ? 1 : -1;
    }
  }
  return filterObj;
};

export default prepareSortCondition;
