const express = require("express");
const router = express.Router();
const userValidator = require("../validation");
const userController = require("../controllers");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userValidator.validateUserData, userController.createUser);

router
  .route("/:userId")
  .get(userValidator.validateUserId, userController.getUser)
  .put(userValidator.validateUserDocument, userController.updateUser)
  .delete(userValidator.validateUserId, userController.deleteUser);

module.exports = router;
