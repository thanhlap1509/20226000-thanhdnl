const ERROR_MSG = {
  MISSING_EMAIL: "Please attach email to body",
  MISSING_PASSWORD: "Please attach password to body",
  MISSING_BODY: "Please attach email and/or password to body",
  INV_EMAIL: "Please enter valid email",
};

const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function authenticateRequest(body, options) {
  let returnObj = {
    isValid: undefined,
    validateMessage: undefined,
  };

  if (options.update) {
    if (!body.email && !body.password) {
      returnObj.isValid = false;
      returnObj.validateMessage = ERROR_MSG.MISSING_BODY;
      return returnObj;
    }

    returnObj.isValid = true;
    returnObj.validateMessage = "Seem good to me";
    return returnObj;
  }

  if (!body.email) {
    returnObj.isValid = false;
    returnObj.validateMessage = ERROR_MSG.MISSING_EMAIL;
    return returnObj;
  }

  if (!regex.test(body.email)) {
    returnObj.isValid = false;
    returnObj.validateMessage = ERROR_MSG.INV_EMAIL;
    return returnObj;
  }

  if (!body.password) {
    returnObj.isValid = false;
    returnObj.validateMessage = ERROR_MSG.MISSING_PASSWORD;
    return returnObj;
  }

  returnObj.isValid = true;
  returnObj.validateMessage = "Seem good to me!";
  return returnObj;
}

module.exports = { authenticateRequest };
