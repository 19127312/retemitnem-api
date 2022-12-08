const Question = require("./questionModel");

exports.createQuestion = async (presentationID, content) => {
  const question = new Question();
  question.presentationID = presentationID;
  question.content = content;
  question.countLike = 0;
  question.isAnswered = false;
  question.sentTime = new Date();
  await question.save();
  return question;
};

exports.findQuestions = async (id) => {
  return Question.find({ presentationID: id }).sort({ sentTime: -1 });
};

exports.updateQuestion = async (question) => {
  Question.findOneAndUpdate(
    { _id: question._id },
    question,
    {
      new: true,
    },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

exports.findQuestionAndDelete = (id) => {
  Question.findByIdAndDelete(id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", docs);
    }
  });
};
