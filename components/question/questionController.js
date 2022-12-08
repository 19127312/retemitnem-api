const questionService = require("../question/questionService");

exports.getQuestions = async (req, res) => {
  const { presentationID } = req.params;
  const questions = await questionService.findQuestions(presentationID);
  res.status(200).json({ questions });
};

exports.createQuestion = async (req, res) => {
  const { presentationID, content } = req.body;
  const question = await questionService.createQuestion(
    presentationID,
    content
  );
  res.status(200).json({ question });
};

exports.updateQuestion = async (req, res) => {
  const { question } = req.body;
  await questionService.updateQuestion(question);
  res.status(200).json({ question });
};
