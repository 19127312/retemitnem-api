const Chat = require("./chatModel");

exports.createChat = async (presentationID, content, isSender) => {
  const chat = new Chat();
  chat.presentationID = presentationID;
  chat.content = content;
  chat.isSender = isSender;
  chat.sentTime = new Date();
  await chat.save();
};

exports.findChats = async (id) => {
  return Chat.find({ presentationID: id }).sort({ sentTime: -1 }).limit(10);
};
exports.findAllChats = async (id) => {
  return Chat.find({ presentationID: id }).sort({ sentTime: -1 });
};
