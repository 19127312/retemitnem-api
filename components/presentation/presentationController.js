const presentationService = require("./presentationService");

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
}

module.exports.viewListOfPresentationsByGroupID = async (req, res) => {
  try {
    const {groupID} = req.params;
    let list = await presentationService.findByGroupID(groupID);
    if (list) {
      res.status(200).json(list);
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