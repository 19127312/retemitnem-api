const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  presentationID: String,
  content: String,
  sentTime: Date,
  isSender: Boolean,
});

module.exports = mongoose.model("Chat", chatSchema);
