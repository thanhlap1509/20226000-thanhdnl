import { Joi } from "express-validation";
import moment from "moment";

const dateValidation = Joi.date()
  .iso()
  .custom((value, helpers) => {
    const date = moment(helpers.original);
    if (date.isValid()) {
      return value;
    }
    return helpers.error("any.invalid");
  });

export default dateValidation;
