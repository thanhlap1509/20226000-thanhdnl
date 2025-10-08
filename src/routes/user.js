import { Router } from "express";
import {
  getUsersValidator,
  createUserValidator,
  queryUserIdValidator,
  updateUserValidator,
  getNDomainValidator,
  queryUserByRoleValidator,
  queryTimePeriodValidator,
} from "../validation/user.js";

import {
  getUsers,
  createUser,
  addExportJob,
  checkExportJob,
  downloadExportCSV,
  getUserCount,
  getUserCountByRoles,
  getUserCountByRole,
  getUserCountByEmailDomains,
  getUserCountByEmailDomain,
  getTopNEmailDomains,
  getLastNEmailDomains,
  getUser,
  updateUser as _updateUser,
  deleteUser,
  getUserAge,
} from "../controllers/user.js";
import httpLogger from "../middlewares/httpLogger.js";
import createModuleLogger from "../utils/createModuleLogger.js";

const router = Router();
const logger = createModuleLogger("user-routes");

router.use(httpLogger(logger));

router
  .route("/")
  .get(getUsersValidator, getUsers)
  .post(createUserValidator, createUser);

router.route("/export").get(getUsersValidator, addExportJob);

router.route("/export/:jobId").get(checkExportJob);

router.route("/export/:jobId/download").get(downloadExportCSV);

router.route("/count").get(getUserCount);

router.route("/role/count").get(getUserCountByRoles);

router
  .route("/role/:role/count")
  .get(queryUserByRoleValidator, getUserCountByRole);

router
  .route("/domain/count")
  .get(queryTimePeriodValidator, getUserCountByEmailDomains);

router
  .route("/domain/:domain/count")
  .get(queryTimePeriodValidator, getUserCountByEmailDomain);

router
  .route("/top/:n/domain/count")
  .get(queryTimePeriodValidator, getNDomainValidator, getTopNEmailDomains);

router
  .route("/bot/:n/domain/count")
  .get(queryTimePeriodValidator, getNDomainValidator, getLastNEmailDomains);

router
  .route("/:userId")
  .get(queryUserIdValidator, getUser)
  .put(updateUserValidator, _updateUser)
  .delete(queryUserIdValidator, deleteUser);

router.route("/:userId/age").get(queryUserIdValidator, getUserAge);

export default router;
