const { ValidationError } = require("express-validation");
const errorCode = require("../error");

const errorHandler = (err, req, res, next) => {
  console.log("-------------");
  console.log(err);
  console.log(err.code);
  console.log(err.statusCode);

  const statusCode = err.code || err.statusCode || errorCode.SERVER_ERROR;
  let returnCode = statusCode;
  let { message } = err;
  let details = err instanceof ValidationError ? err.details : null;
  switch (statusCode) {
    case errorCode.BAD_REQUEST:
      message = "Bad request";
      break;
    case errorCode.NOT_FOUND:
      message = `Resource not found ${req.url}`;
      details = err.details;
      break;
    case errorCode.SERVER_ERROR:
      message = "Server error";
      break;
    case errorCode.USER_EXIST:
      message = "This email is already register";
      returnCode = errorCode.BAD_REQUEST;
      break;
    default:
      message = "Don't know";
      returnCode = errorCode.OK;
      break;
  }
  return res.status(returnCode).json({
    statusCode: statusCode,
    message,
    details,
  });
};

module.exports = errorHandler;
