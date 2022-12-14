var express = require("express");
var router = express.Router();
const passport = require("../../passport/index");
const authController = require("./authController");
const loginPassportMiddleware = require("../../passport/loginPassportMiddleware");
router.post("/register", authController.register);
router.post("/login", loginPassportMiddleware, authController.loginSuccess);
router.post("/refresh-token", authController.createNewRefreshToken);
router.post("/access-token", authController.createNewAccessToken);
router.post("/logout", authController.logout);
router.post("/logout-all", authController.logoutAll);
router.post("/google_login", authController.googleLogin);
router.get("/confirmation/:email/:token", authController.confirmation);
router.post("/forgot_password", authController.forgotPassword);

module.exports = router;
