const express = require("express");
const router = express.Router();
const userController = require("../controllers");

router.route("/").get(userController.getUserCount);

router.route("/by-role").get(userController.getUserCountByRoles);

router.route("/by-role/:role").get(userController.getUserCountByRole);
module.exports = router;
