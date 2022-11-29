const Presentation = require("./presentationModel");

exports.createPresentation = async (title, ownerID, groupID) => {
  const newPresentation = new Presentation();
  newPresentation.title = title;
  newPresentation.slides = [
    {
      questionType: "Multiple Choice",
      question: "",
      key: 0,
      options: [
        {
          option: "",
          optionKey: 0,
        },
      ],
      answers: [
        {
          answerCount: 0,
          answerKey: 0,
        },
      ],
    },
  ];
  var datetime = new Date();
  newPresentation.createdDate = datetime;
  newPresentation.ownerID = ownerID;
  newPresentation.groupID = groupID;
  newPresentation.currentSlide = 0;
  await newPresentation.save();
};

exports.updatePresentation = (presentation) => {
  Presentation.findOneAndUpdate(
    { _id: presentation._id },
    presentation,
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

exports.findByGroupID = async (groupID) => {
  return Presentation.find({ groupID : groupID});
};

exports.findPresentationInfo = (id) => {
  return Presentation.findById({ _id: id }).lean();
};

exports.findPresentationByOwnerAndName = (ownerID, title) => {
  return Presentation.findOne({ ownerID: ownerID, title: title });
};

exports.findPresentationAndDelete = (id) => {
    Presentation.findByIdAndDelete(id, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted : ", docs);
      }
    });
};