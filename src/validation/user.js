// check đầu vào, khi đi qua validation tức đầu vào là đúng và có thể xử lý được
import { Joi, validate } from "express-validation";
import { userFields } from "../models/user.js";
import { USER_ROLES } from "../constants/user.js";
import dateValidation from "./date.js";

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

const createUserTemplate = {
  body: userJoiObject.required(),
};

const queryUserIdTemplate = {
  params: Joi.object({
    userId: userId.required(),
  }),
};

const updateUserTemplate = {
  params: Joi.object({ userId: userId.required() }),
  body: userJoiObject
    .fork(["email", "password", "role"], (schema) => schema.optional())
    .or("email", "password", "role"),
};

const getNDomainTemplate = {
  params: Joi.object({
    n: Joi.number().integer().min(1).required(),
  }),
};

const userFieldsWithoutPassword = userFields.filter(
  (item) => item !== "password",
);
// eslint-disable-next-line max-len
const matchUserFieldRegex = `(?:${userFieldsWithoutPassword.join("|")})\\.(asc|desc)`;
const getUsersTemplate = {
  query: Joi.object({
    sort_by: Joi.string().pattern(
      new RegExp(`^(${matchUserFieldRegex})(,${matchUserFieldRegex})*$`),
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

const queryUserByRoleTemplate = {
  params: Joi.object({
    role: userTemplate.role.optional(),
  }),
};

const queryTimePeriodTemplate = {
  query: Joi.object({
    start_date: timePeriodTemplate.start_date,
    end_date: timePeriodTemplate.end_date,
  })
    .with("start_date", "end_date")
    .with("end_date", "start_date"),
};

export const queryUserIdValidator = validate(queryUserIdTemplate, {
  keyByField: true,
});
export const createUserValidator = validate(createUserTemplate, {
  keyByField: true,
});
export const updateUserValidator = validate(updateUserTemplate, {
  keyByField: true,
});
export const getNDomainValidator = validate(getNDomainTemplate, {
  keyByField: true,
});
export const getUsersValidator = validate(getUsersTemplate, {
  keyByField: true,
});
export const queryUserByRoleValidator = validate(queryUserByRoleTemplate, {
  keyByField: true,
});
export const queryTimePeriodValidator = validate(queryTimePeriodTemplate, {
  keyByField: true,
});
