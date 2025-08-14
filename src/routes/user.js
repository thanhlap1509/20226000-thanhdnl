const express = require("express");
const router = express.Router();
const { validateUserData, validateUserId, validateUserDocument } = require("../validation");
const userController = require("../controllers");

router.route("/").get(userController.getAllUsers).post(validateUserData, userController.createUser);

router
  .route("/:userId")
  .get(validateUserId, userController.getUser)
  .put(validateUserDocument, userController.updateUser)
  .delete(validateUserId, userController.deleteUser);

module.exports = router;
