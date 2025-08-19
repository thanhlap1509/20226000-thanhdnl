// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
const { Joi, validate } = require("express-validation");
const { userFields } = require("../models/user");
const { USER_ROLES } = require("../constants/user");
const createUser = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().trim().required(),
    role: Joi.string()
      .trim()
      .required()
      .valid(...USER_ROLES),
  }),
};

const queryUserId = {
  params: Joi.object({
    userId: Joi.string().trim().required(),
  }).required(),
};

const updateUser = {
  params: queryUserId.params,
  body: createUser.body
    .fork(["email", "password", "role"], (schema) => schema.optional())
    .or("email", "password", "role"),
};

const getNDomain = {
  params: Joi.object({
    n: Joi.number().integer().required(),
  }),
};

const getUsers = {
  query: Joi.object({
    sort_by: Joi.string().pattern(
      new RegExp(
        `^([+-](?:${userFields.join("|")})(,[+-](?:${userFields.join("|")}))*)?$`,
      ),
    ),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
    email: Joi.string().email().trim().lowercase(),
    role: Joi.string()
      .trim()
      .valid(...USER_ROLES),
  }),
};

const queryUserByRole = {
  params: Joi.object({
    role: Joi.string()
      .trim()
      .required()
      .valid(...USER_ROLES),
  }),
};

module.exports = {
  queryUserId: validate(queryUserId, { keyByField: true }),
  createUser: validate(createUser, { keyByField: true }),
  updateUser: validate(updateUser, { keyByField: true }),
  getNDomain: validate(getNDomain, { keyByField: true }),
  getUsers: validate(getUsers, { keyByField: true }),
  queryUserByRole: validate(queryUserByRole, { keyByField: true }),
};
