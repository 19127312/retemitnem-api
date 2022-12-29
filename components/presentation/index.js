var express = require("express");
const router = express.Router();
const presentationController = require("./presentationController");
const jwtMiddleware = require("../../passport/jwtMiddleware");

router.post("/add", presentationController.createPresentation);
router.post("/update", presentationController.updatePresentation);
router.get(
  "/viewByGroupID/:groupID",
  presentationController.viewListOfPresentationsByGroupID
);
router.get(
  "/viewByCurrentLoggedInUser/:userID",
  presentationController.viewListOfPresentationsByCurrentLoggedInUser
);
router.get("/info/:id", presentationController.viewPresentationInfo);
router.post("/delete", presentationController.deletePresentations);
router.get("/collaborator/:id", presentationController.viewCollaborator);
router.post("/setPlayingInGroup", presentationController.setPlayingInGroup);
router.post("/otherPresentations", presentationController.otherPresentations);
router.get(
  "/isValidCollaborator/:email/:currentUserEmail/:presentationID",
  presentationController.isValidCollaborator
);
router.post("/kick", presentationController.KickOutGroupPresentations);

module.exports = router;
