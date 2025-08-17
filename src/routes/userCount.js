const express = require("express");
const router = express.Router();
const userController = require("../controllers");

router.route("/").get(userController.getUserCount);

router.route("/role").get(userController.getUserCountByRoles);

router.route("/role/:role").get(userController.getUserCountByRole);

router.route("/email-domain/").get(userController.getUserCountByEmailDomains);
module.exports = router;
