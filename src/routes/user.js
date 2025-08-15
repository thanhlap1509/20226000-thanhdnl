const express = require("express");
const router = express.Router();
const { createUsers, queryUserId, updateUser } = require("../validation");
const userController = require("../controllers");

router.route("/").get(userController.getAllUsers).post(createUsers, userController.createUser);

router.route("/count").get(userController.getUserCount);

router
  .route("/:userId")
  .get(queryUserId, userController.getUser)
  .put(updateUser, userController.updateUser)
  .delete(queryUserId, userController.deleteUser);

module.exports = router;
