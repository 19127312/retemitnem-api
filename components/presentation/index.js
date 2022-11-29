var express = require("express");
const router = express.Router();
const presentationController = require("./presentationController");
const jwtMiddleware = require("../../passport/jwtMiddleware");

router.post("/add", presentationController.createPresentation);
router.post("/update", presentationController.updatePresentation);
router.get("/viewByGroupID/:groupID", presentationController.viewListOfPresentationsByGroupID);
router.get("/info/:id", presentationController.viewPresentationInfo);
module.exports = router;