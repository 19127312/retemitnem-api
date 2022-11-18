const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
    groupName: String,
    members: [{
        memberID: String,
        role: String,
    }],
    createdDate: Date,
    creatorID: String,
    // creatorEmail: String,
    
});


module.exports = mongoose.model("Group", groupSchema);