const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  presentationID: String,
  content: String,
  countLike: Number,
  sentTime: Date,
  isAnswered: Boolean,
});

module.exports = mongoose.model("Question", questionSchema);
