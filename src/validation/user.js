// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
const { Joi, validate } = require("express-validation");
const { userFields } = require("../models/user");
const { USER_ROLES } = require("../constants/user");

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
    n: Joi.number().integer().required(),
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
        `^([+-]${matchUserFieldRegex}(,[+-]${matchUserFieldRegex})*)?$`,
      ),
    ),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
    email: userTemplate.email.optional(),
    role: userTemplate.role.optional(),
  }),
};

const queryUserByRole = {
  params: Joi.object({
    role: userTemplate.role.optional(),
  }),
};

const dateValidation = Joi.date()
  .iso()
  .custom((value, helpers) => {
    const valueString = helpers.original;
    const valueStringLen = valueString.length;

    const valueISOString = new Date(value).toISOString();

    if (
      valueString.localeCompare(valueISOString.substring(0, valueStringLen)) !==
      0
    ) {
      return helpers.error("any.invalid");
    }

    return value;
  });
const queryTimePeriod = {
  query: Joi.object({
    start_date: dateValidation,
    end_date: dateValidation.greater(Joi.ref("start_date")),
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
