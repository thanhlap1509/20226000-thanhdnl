import { Joi } from "express-validation";
import { USER_ROLES } from "../constants/user.js";
import dateValidation from "./date.js";

const cursorTemplate = Joi.object({
  _id: Joi.string().trim().required(),
  limit: Joi.number().integer().required().min(1),
  sort_by: Joi.object(),
  email: Joi.string().email().trim().lowercase(),
  role: Joi.string()
    .trim()
    .valid(...USER_ROLES),
  start_date: dateValidation,
  end_date: dateValidation.greater(Joi.ref("start_date")),
});

const validateDecodedCursor = (cursor) => {
  const { error } = cursorTemplate.validate(cursor);
  if (error) {
    return false;
  }
  return true;
};

const template = {
  _id: "kdkdd",
  limit: 2,
};
validateDecodedCursor(template);

export default validateDecodedCursor;
