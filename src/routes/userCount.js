const express = require("express");
const router = express.Router();
const userController = require("../controllers");
const { getNDomain } = require("../validation");

router.route("/").get(userController.getUserCount);

router.route("/role").get(userController.getUserCountByRoles);

router.route("/role/:role").get(userController.getUserCountByRole);

router.route("/domain/").get(userController.getUserCountByEmailDomains);

router.route("/domain/:domain").get(userController.getUserCountByEmailDomain);

router.route("/domain/top/:n").get(getNDomain, userController.getTopNEmailDomains);

router.route("/domain/bot/:n").get(getNDomain, userController.getLastNEmailDomains);

module.exports = router;
