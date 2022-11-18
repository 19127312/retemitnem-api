const Group = require('./groupModel');

// exports.findGroupByName = (groupName) =>{
//     return Group.findOne({groupName: groupName}).lean();
// }

exports.findGroupByCreatorAndName = (creatorID, groupName) => {
    return Group.findOne({creatorID: creatorID, groupName: groupName });
}

exports.createGroup = async (groupName, creatorID) => {
    const newGroup = new Group();
    newGroup.groupName = groupName;
    newGroup.members = [{
        memberID : creatorID,
        role: "owner",
    }];
    var datetime = new Date();
    newGroup.createdDate = datetime;
    newGroup.creatorID = creatorID;
    // newGroup.creatorEmail = creatorEmail;
    await newGroup.save();
}

exports.findAll = async () => {
    return Group.find({});
}