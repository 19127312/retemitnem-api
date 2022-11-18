const userModel = require("../auth/userModel");

exports.findUserInfo = (id) => {
    return userModel.findById({_id: id}).lean();

}