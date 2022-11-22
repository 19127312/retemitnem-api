const userModel = require("../auth/userModel");

exports.findUserInfo = (id) => {
    return userModel.findById({_id: id}).lean();
}

exports.updateUser = (user) => {
  userModel.findOneAndUpdate(
    { _id: user._id },
    user,
    {
      new: true,
    },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
    }
  );
};