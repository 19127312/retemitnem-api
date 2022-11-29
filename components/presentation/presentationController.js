const presentationService = require("./presentationService");
const userService = require("../user/userService");

module.exports.createPresentation = async (req, res) => {
  try {
    const { title, ownerID, groupID } = req.body;
    await presentationService.createPresentation(title, ownerID, groupID);
    res.status(200).send("success");
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.updatePresentation = async (req, res) => {
  try {
    const presentation = req.body;
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

module.exports.viewPresentationInfo = async (req, res) => {
  try {
    const { id } = req.params;
    let list = await presentationService.findPresentationInfo(id);
    if (list) {
      res.status(200).json(list);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};
