var express = require("express");
const router = express.Router();
const chatController = require("./chatController");
router.get("/:presentationID", chatController.getInitChats);
router.post("/", chatController.createChat);
router.post("/more", chatController.getMoreChats);

module.exports = router;
