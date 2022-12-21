const presentationService = require("./presentationService");
const userService = require("../user/userService");
const { use } = require("passport");

module.exports.createPresentation = async (req, res) => {
  try {
    const { title, ownerID, groupID } = req.body;
    const existPresentation =
      await presentationService.findPresentationByOwnerAndName(ownerID, title);
    if (!existPresentation) {
      await presentationService.createPresentation(title, ownerID, groupID);
      res.status(200).send("success");
    } else {
      res.status(409).send("presentation name has already been used");
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.updatePresentation = async (req, res) => {
  try {
    const { presentation } = req.body;
    presentationService.updatePresentation(presentation);
    res.status(200).json(presentation);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewListOfPresentationsByGroupID = async (req, res) => {
  try {
    const { groupID } = req.params;
    let list = await presentationService.findByGroupID(groupID);
    if (list) {
      let newList = JSON.parse(JSON.stringify(list));
      for (let i = 0; i < newList.length; i++) {
        const ownerInfo = await userService.findUserInfo(newList[i].ownerID);
        newList[i] = {
          ...newList[i],
          ownerName: ownerInfo.fullName,
        };
      }

      res.status(200).json(newList);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewListOfPresentationsByCurrentLoggedInUser = async (
  req,
  res
) => {
  try {
    const { userID } = req.params;
    let list = await presentationService.findByCurrentLoggedInUser(userID);
    if (list) {
      let newList = JSON.parse(JSON.stringify(list));
      for (let i = 0; i < newList.length; i++) {
        const ownerInfo = await userService.findUserInfo(newList[i].ownerID);
        newList[i] = {
          ...newList[i],
          ownerName: ownerInfo.fullName,
        };
      }

      res.status(200).json(newList);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewPresentationInfo = async (req, res) => {
  try {
    const { id } = req.params;
    let presentation = await presentationService.findPresentationInfo(id);
    if (presentation) {
      res.status(200).json(presentation);
    } else {
      res.status(409).json({ errorMessage: "Presentation not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.deletePresentations = async (req, res) => {
  try {
    const { presentationIDs } = req.body;
    for (let i = 0; i < presentationIDs.length; i++) {
      presentationService.findPresentationAndDelete(presentationIDs[i]);
    }
    res.status(200).send("success");
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    let presentation = await presentationService.findPresentationInfo(id);
    if (presentation) {
      let newList = JSON.parse(JSON.stringify(presentation.collaborators));
      for (let i = 0; i < newList.length; i++) {
        const collaboratorInfo = await userService.findUserInfo(newList[i]);
        newList[i] = {
          id: newList[i],
          fullName: collaboratorInfo.fullName,
          email: collaboratorInfo.email,
        };
      }
      res.status(200).json(newList);
    } else {
      res.status(409).json({ errorMessage: "Collaborators not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.setPlayingInGroup = async (req, res) => {
  try {
    const { presentationID, groupID } = req.body;
    // let list = await presentationService.findByGroupID(groupID);
    let presentation = await presentationService.findPresentationInfo(
      presentationID
    );
    presentation.isPlayingInGroup = true;
    presentationService.updatePresentation(presentation);

    let list = await presentationService.findByGroupID(groupID);
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id != presentationID) {
          list[i].isPlayingInGroup = false;
          presentationService.updatePresentation(list[i]);
        }
      }
    }

    // await presentationService.setPlayingInGroup(presentationID, groupID);
    res.status(200).send("success");
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};
module.exports.otherPresentations = async (req, res) => {
  const { presentationID, groupID } = req.body;
  // let list = await presentationService.findByGroupID(groupID);
  let presentation = await presentationService.findPresentationInfo(
    presentationID
  );
};
