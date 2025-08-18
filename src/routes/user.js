const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUsers,
  queryUserId,
  updateUser,
} = require("../validation");
const userCount = require("./userCount");
const userController = require("../controllers");

router
  .route("/")
  .get(getUsers, userController.getAllUsers)
  .post(createUsers, userController.createUser);

router
  .route("/:userId")
  .get(queryUserId, userController.getUser)
  .put(updateUser, userController.updateUser)
  .delete(queryUserId, userController.deleteUser);

router.route("/:userId/age").get(userController.getUserAge);

router.use("/count", userCount);

module.exports = router;
