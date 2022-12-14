const mongoose = require("mongoose");
const presentationSchema = new mongoose.Schema({
  title: String,
  slides: [
    {
      questionType: String,
      question: String,
      subHeading: String,
      image: String,
      key: Number,
      options: [
        {
          option: String,
          optionKey: Number,
        },
      ],
      answers: [
        {
          answerCount: Number,
          answerKey: Number,
        },
      ],
    },
  ],
  createdDate: Date,
  ownerID: String,
  groupID: String,
  currentSlide: Number,
  playSlide: Number,
  isPrivate: Boolean,
  collaborators: [String],
  isPlayingInGroup: Boolean,
});

module.exports = mongoose.model("Presentation", presentationSchema);
