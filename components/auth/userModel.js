const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullName: String,
    password: String,
    email: String,
});


module.exports = mongoose.model("User", userSchema);
