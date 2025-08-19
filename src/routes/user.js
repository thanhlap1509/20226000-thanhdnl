const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  queryUserId,
  updateUser,
  getNDomain,
  queryUserByRole,
} = require("../validation");

const userController = require("../controllers");

router
  .route("/")
  .get(getUsers, userController.getAllUsers)
  .post(createUser, userController.createUser);

router
  .route("/:userId")
  .get(queryUserId, userController.getUser)
  .put(updateUser, userController.updateUser)
  .delete(queryUserId, userController.deleteUser);

router.route("/:userId/age").get(queryUserId, userController.getUserAge);

router.route("/count").get(userController.getUserCount);

router.route("/count/role").get(userController.getUserCountByRoles);

router
  .route("/count/role/:role")
  .get(queryUserByRole, userController.getUserCountByRole);

router.route("/count/domain/").get(userController.getUserCountByEmailDomains);

router
  .route("/count/domain/:domain")
  .get(userController.getUserCountByEmailDomain);

router
  .route("/count/domain/top/:n")
  .get(getNDomain, userController.getTopNEmailDomains);

router
  .route("/count/domain/bot/:n")
  .get(getNDomain, userController.getLastNEmailDomains);

module.exports = router;
