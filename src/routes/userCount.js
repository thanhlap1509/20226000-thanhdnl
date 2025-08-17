const express = require("express");
const router = express.Router();
const userController = require("../controllers");

router.route("/").get(userController.getUserCount);

router.route("/by-role").get(userController.getUserCountByRoles);

module.exports = router;
