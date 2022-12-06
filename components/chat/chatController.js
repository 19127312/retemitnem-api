const chatService = require("../chat/chatService");

exports.getInitChats = async (req, res) => {
  const { presentationID } = req.params;
  const chats = await chatService.findChats(presentationID);
  res.status(200).json({ chats });
};

exports.createChat = async (req, res) => {
  const { presentationID, content, isSender } = req.body;
  await chatService.createChat(presentationID, content, isSender);
  res.status(200).json({ message: "success" });
};
exports.getMoreChats = async (req, res) => {
  const { presentationID, lastChatID } = req.body;
  console.log(lastChatID);
  console.log("get more chats");
  const chats = await chatService.findAllChats(presentationID);
  let i = 0;
  for (; i < chats.length; i++) {
    if (chats[i]._id == lastChatID) {
      // res.status(200).json({ chats: chats.slice(0, i) });
      break;
    }
  }
  console.log(i);
  console.log(chats.length);
  if (chats.length - i > 10) {
    res.status(200).json({ chats: chats.slice(i + 1, i + 11) });
  } else {
    res.status(200).json({ chats: chats.slice(i + 1, chats.length) });
  }
};
