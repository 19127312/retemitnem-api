const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullName: String,
    password: String,
    email: String,
    isVerified: { type: Boolean, default: false },
});


module.exports = mongoose.model("User", userSchema);
