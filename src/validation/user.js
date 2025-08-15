// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
const { Joi, validate } = require("express-validation");

const createUser = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().trim().required(),
  role: Joi.string().trim().required().valid("admin", "user"),
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
    .fork(["email", "password", "role"], (schema) => schema.required())
    .or("email", "password", "role")
    .required(),
};

module.exports = {
  queryUserId: validate(queryUserId, { keyByField: true }),
  createUsers: validate(createUsers, { keyByField: true }),
  updateUser: validate(updateUser, { keyByField: true }),
};
