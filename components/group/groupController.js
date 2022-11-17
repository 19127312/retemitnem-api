const groupService = require('./groupService');

module.exports.createGroup = async (req, res) => {
    try {
        const { groupName,creatorID, creatorEmail } = req.body;
        // User input validation
        // ...
        // User input validation in frontend

        const existGroup = await groupService.findGroupByCreatorAndName(creatorID, groupName);
        if (!existGroup) {
            await groupService.createGroup(groupName, creatorID, creatorEmail);
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
        const list = await groupService.findAll();
        if (list) {
            console.log(list);
            res.status(200).json(list);
        }

    } catch (e) {
        res.status(400).json({ errorMessage: e.message ?? 'Unknown error' });
    }
}