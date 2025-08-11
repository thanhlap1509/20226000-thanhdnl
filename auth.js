const ERROR_MGS = {
  MISSING_EMAIL: "Please attach email to body",
  INV_EMAIL: "Please enter valid email",
  MISSING_PASSWORD: "Please attach password to body",
};

const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

function authenticateRequest(body) {
  let isValid;
  let validateMessage;

  if (!body.email) {
    isValid = false;
    validateMessage = ERROR_MGS.MISSING_EMAIL;
    return {
      isValid,
      validateMessage,
    };
  }

  if (!regex.test(body.email)) {
    isValid = false;
    validateMessage = ERROR_MGS.INV_EMAIL;
    return {
      isValid,
      validateMessage,
    };
  }

  if (!body.password) {
    isValid = false;
    validateMessage = ERROR_MGS.MISSING_PASSWORD;
    return {
      isValid,
      validateMessage,
    };
  }

  isValid = true;
  validateMessage = "Seem good to me!";
  return { isValid, validateMessage };
}

module.exports = { authenticateRequest };
