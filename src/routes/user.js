const express = require("express");
const router = express.Router();
const userController = require("../controllers");

router.route("/").get(userController.getUsers).post(userController.createUser);

router
  .route("/:userId")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
