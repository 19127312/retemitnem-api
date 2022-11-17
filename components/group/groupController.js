const groupService = require('./groupService');

module.exports.createGroup = async (req, res) =>{
    try {
        const { groupName, members, createdDate, creatorID} = req.body;
        // User input validation
        // ...
        // User input validation in frontend
    
        const existGroup = await groupService.findGroupByCreatorAndName(creatorID, groupName);
        if(!existGroup){
          await groupService.createGroup(groupName, creatorID);
          res.status(200).send('success');
        }else{
          res.status(409).send('group name has already been used');
        }
        
      } catch (e) {
        res.status(400).json({errorMessage: e.message ?? 'Unknown error'});
      }
}