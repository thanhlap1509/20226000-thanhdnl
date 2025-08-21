// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
const moment = require("moment");
const { Joi, validate } = require("express-validation");
const { userFields } = require("../models/user");
const { USER_ROLES } = require("../constants/user");

const dateValidation = Joi.date()
  .iso()
  .custom((value, helpers) => {
    const date = moment(helpers.original);
    if (date.isValid()) {
      return value;
    }
    return helpers.error("any.invalid");
  });

const timePeriodTemplate = {
  start_date: dateValidation,
  end_date: dateValidation.greater(Joi.ref("start_date")),
};

const userTemplate = {
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().trim(),
  role: Joi.string()
    .trim()
    .valid(...USER_ROLES),
};

const userJoiObject = Joi.object({
  email: userTemplate.email.required(),
  password: userTemplate.password.required(),
  role: userTemplate.role.required(),
});

const userId = Joi.string().trim();

const createUser = {
  body: userJoiObject.required(),
};

const queryUserId = {
  params: Joi.object({
    userId: userId.required(),
  }),
};

const updateUser = {
  params: Joi.object({ userId: userId.required() }),
  body: userJoiObject
    .fork(["email", "password", "role"], (schema) => schema.optional())
    .or("email", "password", "role"),
};

const getNDomain = {
  params: Joi.object({
    n: Joi.number().integer().min(1).required(),
  }),
};

const userFieldsWithoutPassword = userFields.filter(
  (item) => item !== "password",
);
const matchUserFieldRegex = `(?:${userFieldsWithoutPassword.join("|")})`;
const getUsers = {
  query: Joi.object({
    sort_by: Joi.string().pattern(
      new RegExp(
        // eslint-disable-next-line max-len
        `^(${matchUserFieldRegex}\\.(asc|desc))(,${matchUserFieldRegex}\\.(asc|desc))*$`,
      ),
    ),
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(0),
    cursor: Joi.string(),
    email: userTemplate.email.optional(),
    role: userTemplate.role.optional(),
    start_date: timePeriodTemplate.start_date.optional(),
    end_date: timePeriodTemplate.end_date.optional(),
  })
    .with("start_date", "end_date")
    .with("end_date", "start_date")
    .without("cursor", "offset")
    .without("offset", "cursor"),
};

const queryUserByRole = {
  params: Joi.object({
    role: userTemplate.role.optional(),
  }),
};

const queryTimePeriod = {
  query: Joi.object({
    start_date: timePeriodTemplate.start_date,
    end_date: timePeriodTemplate.end_date,
  })
    .with("start_date", "end_date")
    .with("end_date", "start_date"),
};

module.exports = {
  queryUserId: validate(queryUserId, { keyByField: true }),
  createUser: validate(createUser, { keyByField: true }),
  updateUser: validate(updateUser, { keyByField: true }),
  getNDomain: validate(getNDomain, { keyByField: true }),
  getUsers: validate(getUsers, { keyByField: true }),
  queryUserByRole: validate(queryUserByRole, { keyByField: true }),
  queryTimePeriod: validate(queryTimePeriod, { keyByField: true }),
};
