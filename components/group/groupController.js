const groupService = require("./groupService");
const userService = require("../user/userService");

module.exports.createGroup = async (req, res) => {
  try {
    const { groupName, creatorID } = req.body;

    const existGroup = await groupService.findGroupByCreatorAndName(
      creatorID,
      groupName
    );
    if (!existGroup) {
      await groupService.createGroup(groupName, creatorID);
      res.status(200).send("success");
    } else {
      res.status(409).send("group name has already been used");
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewListOfGroups = async (req, res) => {
  try {
    let list = await groupService.findAll();
    if (list) {
      let newList = JSON.parse(JSON.stringify(list));

      for (let i = 0; i < newList.length; i++) {
        // copy members into new array
        let newMemberList = list[i].members.map((item) => {
          return {
            _id: item._id,
            memberID: item.memberID,
            role: item.role,
          };
        });
        for (let j = 0; j < newMemberList.length; j++) {
          const memberInfo = await userService.findUserInfo(
            newMemberList[j].memberID
          );
          newMemberList[j] = {
            ...newMemberList[j],
            memberName: memberInfo.fullName,
            memberEmail: memberInfo.email,
          };
          console.log("list", newMemberList[j]);
          newList[i].members[j] = newMemberList[j];
        }
      }

      for (let i = 0; i < newList.length; i++) {
        const userInfo = await userService.findUserInfo(newList[i].creatorID);
        newList[i] = {
          ...newList[i],
          creatorName: userInfo.fullName,
          creatorEmail: userInfo.email,
        };
      }
      res.status(200).json(newList);
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewGroupInfo = async (req, res) => {
  try {
    const { groupID } = req.body;
    let list = await groupService.findGroupInfo(groupID);
    if (list) {
      let newList = JSON.parse(JSON.stringify(list));

      // copy members into new array
      let newMemberList = list.members.map((item) => {
        return {
          _id: item._id,
          memberID: item.memberID,
          role: item.role,
        };
      });

      for (let j = 0; j < newMemberList.length; j++) {
        const memberInfo = await userService.findUserInfo(
          newMemberList[j].memberID
        );
        newMemberList[j] = {
          ...newMemberList[j],
          memberName: memberInfo.fullName,
          memberEmail: memberInfo.email,
        };
        newList.members[j] = newMemberList[j];
      }

      const userInfo = await userService.findUserInfo(newList.creatorID);
      newList = {
        ...newList,
        creatorName: userInfo.fullName,
        creatorEmail: userInfo.email,
      };

      res.status(200).json(newList);
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.changeRole = async (req, res) => {
  try {
    const { groupID, memberID, role } = req.body;
    const groupInfo = await groupService.findGroupInfo(groupID);

    let newGroupInfo = JSON.parse(JSON.stringify(groupInfo));
    for (let i = 0; i < newGroupInfo.members.length; i++) {
      if (newGroupInfo.members[i].memberID === memberID) {
        newGroupInfo.members[i].role = role;
        break;
      }
    }
    groupService.updateGroup(newGroupInfo);
    res.status(200).json(newGroupInfo);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.kickMember = async (req, res) => {
  try {
    const { groupID, memberID } = req.body;
    const groupInfo = await groupService.findGroupInfo(groupID);

    let newGroupInfo = JSON.parse(JSON.stringify(groupInfo));
    for (let i = 0; i < newGroupInfo.members.length; i++) {
      if (newGroupInfo.members[i].memberID === memberID) {
        newGroupInfo.members.splice(i, i + 1);
        break;
      }
    }
    groupService.updateGroup(newGroupInfo);
    res.status(200).json(newGroupInfo);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.addMember = async (req, res) => {
  try {
    const { groupID, memberID } = req.body;
    const groupInfo = await groupService.findGroupInfo(groupID);

    let newGroupInfo = JSON.parse(JSON.stringify(groupInfo));
    let newMember = {
      memberID: memberID,
      role: "member",
    };

    for (let i = 0; i < newGroupInfo.members.length; i++) {
      if (newGroupInfo.members[i].memberID === memberID) {
        res.status(409).send("this member has already been in group");
        return;
      }
    }

    newGroupInfo.members.push(newMember);

    groupService.updateGroup(newGroupInfo);
    res.status(200).json(newGroupInfo);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};
