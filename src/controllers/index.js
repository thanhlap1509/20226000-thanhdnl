const catchAsyncWrapper = require("../utils/catchAsyncWrapper");

module.exports = {
  userController: catchAsyncWrapper(require("./user")),
};
