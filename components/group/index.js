var express = require('express');
const router = express.Router();
const groupController = require('./groupController');
const jwtMiddleware = require("../../passport/jwtMiddleware");

router.post('/add', jwtMiddleware, groupController.createGroup);
router.get("/info", jwtMiddleware, groupController.viewListOfGroups);
router.post("/role", jwtMiddleware, groupController.changeRole);
router.post("/deletemember", jwtMiddleware, groupController.kickMember);
router.post("/addmember", jwtMiddleware, groupController.addMember);
router.get("/detail", jwtMiddleware, groupController.viewGroupInfo);
module.exports = router;