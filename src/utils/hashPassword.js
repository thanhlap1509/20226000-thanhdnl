const bcrypt = require("bcryptjs");
const { SALT_ROUNDS } = require("../constants/user");
const CustomError = require("../error/customError");
const errorCode = require("../error/code");

const hashPassword = async (userPassword) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    return hashedPassword;
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    const error = new CustomError(errorCode.SERVER_ERROR);
    error.details = "Error hashing password";
    throw error;
  }
};

module.exports = hashPassword;
