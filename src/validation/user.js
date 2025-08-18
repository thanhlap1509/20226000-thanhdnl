// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
const { Joi, validate } = require("express-validation");
const { userRoles, userFields } = require("../models/user");
const { query } = require("express");
const createUser = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().trim().required(),
  role: Joi.string()
    .trim()
    .required()
    .valid(...userRoles),
});

const createUsers = {
  body: Joi.alternatives()
    .try(
      createUser, // single object
      Joi.array().items(createUser), // array of objects
    )
    .required(),
};

const queryUserId = {
  params: Joi.object({
    userId: Joi.string().trim().required(),
  }).required(),
};

const updateUser = {
  params: queryUserId.params,
  body: createUser
    .fork(["email", "password", "role"], (schema) => schema.optional())
    .or("email", "password", "role")
    .with("domain", "email"),
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
  }),
};

const queryUserByRole = {
  params: Joi.object({
    role: Joi.string()
      .trim()
      .required()
      .valid(...userRoles),
  }),
};

module.exports = {
  queryUserId: validate(queryUserId, { keyByField: true }),
  createUsers: validate(createUsers, { keyByField: true }),
  updateUser: validate(updateUser, { keyByField: true }),
  getNDomain: validate(getNDomain, { keyByField: true }),
  getUsers: validate(getUsers, { keyByField: true }),
  queryUserByRole: validate(queryUserByRole, { keyByField: true }),
};
