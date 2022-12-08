var express = require("express");
const router = express.Router();
const questionController = require("./questionController");
router.get("/:presentationID", questionController.getQuestions);
router.post("/", questionController.createQuestion);
router.post("/update", questionController.updateQuestion);
router.post("/delete", questionController.deleteQuestions);

module.exports = router;
