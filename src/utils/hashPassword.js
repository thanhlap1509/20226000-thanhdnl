import { genSalt, hash } from "bcryptjs";
import { SALT_ROUNDS } from "../constants/user.js";
import CustomError from "../error/customError.js";
import { SERVER_ERROR } from "../error/code.js";

const hashPassword = async (userPassword) => {
  try {
    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(userPassword, salt);
    return hashedPassword;
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    const error = new CustomError(SERVER_ERROR);
    error.details = "Error hashing password";
    throw error;
  }
};

export default hashPassword;
