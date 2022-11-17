var express = require('express');
const router = express.Router();
const groupController = require('./groupController');

router.post('/add', groupController.createGroup);

module.exports = router;