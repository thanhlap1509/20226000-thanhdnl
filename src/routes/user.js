const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  queryUserId,
  updateUser,
  getNDomain,
  queryUserByRole,
  queryTimePeriod,
} = require("../validation/user");

const userController = require("../controllers/user");

router
  .route("/")
  .get(getUsers, userController.getUsers)
  .post(createUser, userController.createUser);

router.route("/export").get(getUsers, userController.addExportJob);

router.route("/export/:jobId").get(userController.checkExportJob);

router.route("/export/:jobId/download").get(userController.downloadExportCSV);

router.route("/count").get(userController.getUserCount);

router.route("/role/count").get(userController.getUserCountByRoles);

router
  .route("/role/:role/count")
  .get(queryUserByRole, userController.getUserCountByRole);

router
  .route("/domain/count")
  .get(queryTimePeriod, userController.getUserCountByEmailDomains);

router
  .route("/domain/:domain/count")
  .get(queryTimePeriod, userController.getUserCountByEmailDomain);

router
  .route("/top/:n/domain/count")
  .get(queryTimePeriod, getNDomain, userController.getTopNEmailDomains);

router
  .route("/bot/:n/domain/count")
  .get(queryTimePeriod, getNDomain, userController.getLastNEmailDomains);

router
  .route("/:userId")
  .get(queryUserId, userController.getUser)
  .put(updateUser, userController.updateUser)
  .delete(queryUserId, userController.deleteUser);

router.route("/:userId/age").get(queryUserId, userController.getUserAge);

module.exports = router;
