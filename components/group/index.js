var express = require('express');
const router = express.Router();
const groupController = require('./groupController');
const jwtMiddleware = require("../../passport/jwtMiddleware");

router.post('/add', jwtMiddleware, groupController.createGroup);
router.get('/info', jwtMiddleware, groupController.viewListOfGroups);

module.exports = router;