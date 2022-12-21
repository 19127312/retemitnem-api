const groupService = require("./groupService");
const userService = require("../user/userService");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewGroupInfo = async (req, res) => {
  try {
    const { groupID } = req.params;

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
    // insert more fields

    let newList = JSON.parse(JSON.stringify(newGroupInfo));

    // copy members into new array
    let newMemberList = newGroupInfo.members.map((item) => {
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

    // res.status(200).json(newGroupInfo);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.kickMember = async (req, res) => {
  try {
    const { groupID, memberID } = req.body;
    const groupInfo = await groupService.findGroupInfo(groupID);

    let newGroupInfo = JSON.parse(JSON.stringify(groupInfo));
    const length = newGroupInfo.members.length;
    for (let i = 0; i < length; i++) {
      if (newGroupInfo.members[i].memberID === memberID) {
        newGroupInfo.members.splice(i, 1);
        break;
      }
    }
    groupService.updateGroup(newGroupInfo);

    // insert more fields

    let newList = JSON.parse(JSON.stringify(newGroupInfo));
    // copy members into new array
    let newMemberList = newGroupInfo.members.map((item) => {
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
    // res.status(200).json(newGroupInfo);
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
    // insert more fields

    let newList = JSON.parse(JSON.stringify(newGroupInfo));
    // copy members into new array
    let newMemberList = newGroupInfo.members.map((item) => {
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
    // res.status(200).json(newGroupInfo);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.sendLinkToEmail = async (req, res) => {
  try {
    const { groupID, emailList } = req.body;
    const host = req.headers.origin;
    const msg = {
      to: emailList, // Change to your recipient
      from: "retemitnem@gmail.com", // Change to your verified sender
      subject: "Account Verification Link",
      text: "Hello",
      html:
        "<strong>Click this link to join group: " +
        "\n" +
        host +
        "/joinlink/" +
        groupID +
        "</strong>",
    };

    sgMail
      .sendMultiple(msg)
      .then(() => {
        return res.status(200).json({
          message: "Send link successfully.",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          msg: "Technical Issue!, Please check your Email.",
        });
      });
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.checkMemberInGroup = async (req, res) => {
  try {
    let found = false;
    const { groupID, memberID } = req.body;
    let group = await groupService.findGroupInfo(groupID);
    for (let i = 0; i < group.members.length; i++) {
      if (group.members[i].memberID === memberID) {
        found = true;
        break;
      }
    }
    if (found) {
      res.status(200).send("member is in group");
    } else {
      res.status(200).send("member is not in group");
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.deleteGroup = async (req, res) => {
  try {
    const { groupID } = req.body;
    groupService.findGroupAndDelete(groupID);
    res.status(200).send("success");
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};

module.exports.viewAllGroupOfOwnerPresentation = async (req, res) => {
  try {
    const { ownerID } = req.body;
    let list = await groupService.findGroupInfoByOwner(ownerID);
    res.status(200).send(list);
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e.message ?? "Unknown error" });
  }
};
