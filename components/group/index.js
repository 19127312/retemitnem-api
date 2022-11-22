var express = require("express");
const router = express.Router();
const groupController = require("./groupController");
const jwtMiddleware = require("../../passport/jwtMiddleware");

router.post("/add", jwtMiddleware, groupController.createGroup);
router.get("/info", jwtMiddleware, groupController.viewListOfGroups);
router.post("/role", groupController.changeRole);
router.post("/deletemember", groupController.kickMember);
router.post("/addmember", groupController.addMember);
router.post("/sendlinktoemail", groupController.sendLinkToEmail);
module.exports = router;
