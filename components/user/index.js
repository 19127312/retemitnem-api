var express = require("express");
var router = express.Router();
const passport = require("../../passport/index");
const userController = require("./userController");
const jwtMiddleware = require("../../passport/jwtMiddleware");
router.get("/profile", jwtMiddleware, userController.getProfile);
module.exports = router;