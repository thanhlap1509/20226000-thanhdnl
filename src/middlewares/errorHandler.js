import { ValidationError } from "express-validation";
import {
  SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  USER_EXIST,
  OUT_OF_MEM,
  REQUEST_TOO_LARGE,
  OK,
} from "../error/code.js";

const errorHandler = (err, req, res, next) => {
  console.log("-------------");
  console.log(err);
  console.log(err.code);
  console.log(err.statusCode);

  let statusCode;
  if (Number.isInteger(err.code)) {
    statusCode = err.code;
  } else if (Number.isInteger(err.statusCode)) {
    statusCode = err.statusCode;
  } else {
    statusCode = SERVER_ERROR;
  }

  let returnCode = statusCode;
  let { message } = err;
  let details = err instanceof ValidationError ? err.details : null;
  switch (statusCode) {
    case BAD_REQUEST:
      message = "Bad request";
      details = err.details;
      break;
    case NOT_FOUND:
      message = `Resource not found ${req.url}`;
      details = err.details;
      break;
    case SERVER_ERROR:
      message = "Server error";
      details = err.details;
      break;
    case USER_EXIST:
      message = "This email is already register";
      returnCode = BAD_REQUEST;
      details = err.details;
      break;
    case OUT_OF_MEM:
      message = "Error from Atlas";
      returnCode = SERVER_ERROR;
      details = err.errorResponse.errmsg;
      break;
    case REQUEST_TOO_LARGE:
      message = "Request is too large";
      details = err.details;
      break;
    default:
      message = "Don't know";
      returnCode = OK;
      details = err.details;
      break;
  }
  return res.status(returnCode).json({
    statusCode: statusCode,
    message,
    details,
  });
};

export default errorHandler;
