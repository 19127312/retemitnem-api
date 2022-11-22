var express = require("express");
var router = express.Router();
const passport = require("../../passport/index");
const userController = require("./userController");
const jwtMiddleware = require("../../passport/jwtMiddleware");
router.get("/profile", jwtMiddleware, userController.getProfile);
router.post("/changename", userController.changeName);
router.post("/changepassword", userController.changePassword);
module.exports = router;