// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
const { Joi, validate } = require("express-validation");

const singleUserSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().trim().required(),
});

const userData = {
  body: Joi.alternatives()
    .try(
      singleUserSchema, // single object
      Joi.array().items(singleUserSchema), // array of objects
    )
    .required(),
};

const userId = {
  params: Joi.object({
    userId: Joi.string().trim().required(),
  }).required(),
};

const userDocument = {
  params: Joi.object({
    userId: Joi.string().trim().required(),
  }).required(),
  body: Joi.object({
    email: Joi.string().email().trim().lowercase(),
    password: Joi.string().trim(),
  })
    .or("email", "password")
    .required(),
};

module.exports = {
  validateUserId: validate(userId, { keyByField: true }),
  validateUserData: validate(userData, { keyByField: true }),
  validateUserDocument: validate(userDocument, { keyByField: true }),
};
