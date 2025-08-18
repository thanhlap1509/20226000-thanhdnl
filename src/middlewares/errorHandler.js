const { ValidationError } = require("express-validation");
const { errorCode } = require("../error");

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
      details = err.details;
      break;
    case errorCode.NOT_FOUND:
      message = `Resource not found ${req.url}`;
      details = err.details;
      break;
    case errorCode.SERVER_ERROR:
      message = "Server error";
      details = err.details;
      break;
    case errorCode.USER_EXIST:
      message = "This email is already register";
      returnCode = errorCode.BAD_REQUEST;
      details = err.details;
      break;
    case errorCode.OUT_OF_MEM:
      message = "Atlas quota is full";
      returnCode = errorCode.SERVER_ERROR;
      details = err.errorResponse.errmsg;
      break;
    case errorCode.REQUEST_TOO_LARGE:
      message = "Request is too large";
      details = err.details;
      break;
    default:
      message = "Don't know";
      returnCode = errorCode.OK;
      details = err.details;
      break;
  }
  return res.status(returnCode).json({
    statusCode: statusCode,
    message,
    details,
  });
};

module.exports = errorHandler;
