const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);