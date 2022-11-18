const groupService = require('./groupService');
const userService = require("../user/userService");

module.exports.createGroup = async (req, res) => {
    try {
        const { groupName, creatorID } = req.body;
        // User input validation
        // ...
        // User input validation in frontend

        const existGroup = await groupService.findGroupByCreatorAndName(creatorID, groupName);
        if (!existGroup) {
            await groupService.createGroup(groupName, creatorID);
            res.status(200).send('success');
        } else {
            res.status(409).send('group name has already been used');
        }

    } catch (e) {
        res.status(400).json({ errorMessage: e.message ?? 'Unknown error' });
    }
}

module.exports.viewListOfGroups = async (req, res) => {
    try {
        let list = await groupService.findAll();
        if (list) {
            for(let i =0; i < list.length; i++){
                let newMemberList = list[i].members.map(item => {
                    return{
                        _id: item._id,
                        memberID : item.memberID,
                        role : item.role
                    }
                })
                for (let j = 0; j < newMemberList.length; j++) {
                    const memberInfo = await userService.findUserInfo(newMemberList[j].memberID);
                    newMemberList[j] = {...newMemberList[i], memberName: memberInfo.fullName, memberEmail: memberInfo.email }
                }
            }

            console.log("list", list.members);

            

            let newList = list.map(item => {
                return {
                    _id: item._id,
                    members: item.members,
                    createdDate: item.createdDate,
                    creatorID: item.creatorID,
                    groupName: item.groupName
                }
            })


            for (let i = 0; i < newList.length; i++) {
                const userInfo = await userService.findUserInfo(newList[i].creatorID);
                newList[i] = { ...newList[i], creatorName: userInfo.fullName, creatorEmail: userInfo.email };
            }
            res.status(200).json(newList);
        }

    } catch (e) {
        res.status(400).json({ errorMessage: e.message ?? 'Unknown error' });
    }
}