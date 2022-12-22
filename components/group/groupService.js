const Group = require("./groupModel");

// exports.findGroupByName = (groupName) =>{
//     return Group.findOne({groupName: groupName}).lean();
// }

exports.findGroupByCreatorAndName = (creatorID, groupName) => {
  return Group.findOne({ creatorID: creatorID, groupName: groupName });
};

exports.createGroup = async (groupName, creatorID) => {
  const newGroup = new Group();
  newGroup.groupName = groupName;
  newGroup.members = [
    {
      memberID: creatorID,
      role: "owner",
    },
  ];
  var datetime = new Date();
  newGroup.createdDate = datetime;
  newGroup.creatorID = creatorID;
  // newGroup.creatorEmail = creatorEmail;
  await newGroup.save();
};

exports.findAll = async () => {
  return Group.find({});
};

exports.findGroupInfo = (id) => {
  return Group.findById({ _id: id }).lean();
};

exports.findGroupInfoByOwner = (id) => {
  console.log(id);
  return Group.find({ creatorID: id }).lean();
};

exports.updateGroup = (group) => {
  Group.findOneAndUpdate(
    { _id: group._id },
    group,
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

exports.findGroupAndDelete = (id) => {
  Group.findByIdAndDelete(id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", docs);
    }
  });
};
