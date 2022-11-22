const userService = require("./userService");
const authService = require("../auth/authService");
const bcrypt = require("bcrypt");

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

module.exports.changeName = async (req, res) => {
  try {
    const { userID, newName } = req.body;
    const userInfo = await userService.findUserInfo(userID);
    let newUserInfo = JSON.parse(JSON.stringify(userInfo));
    newUserInfo.fullName = newName;
    userService.updateUser(newUserInfo);
    res.status(200).json({
      _id: newUserInfo._id,
      fullName: newUserInfo.fullName,
      email: newUserInfo.email,
    });
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const { userID, oldPassword, newPassword } = req.body;
    const userInfo = await userService.findUserInfo(userID);
    // check oldPassword
    const isValid = await authService.validPassword(oldPassword, userInfo);
    if (isValid) {
      // update password
      let newUserInfo = JSON.parse(JSON.stringify(userInfo));
      const passwordHash = await bcrypt.hash(newPassword, 10);
      newUserInfo.password = passwordHash;
      userService.updateUser(newUserInfo);
      res.status(200).json({
        _id: newUserInfo._id,
        fullName: newUserInfo.fullName,
        email: newUserInfo.email,
      });
    } else {
      res.status(409).json({ errorMessage: "incorrect password" });
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};
