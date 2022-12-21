const { Server } = require("socket.io");

module.exports.createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3001", "https://retemitnem.vercel.app"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", function (socket) {
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_presentation", (data) => {
      socket.join(data);
    });
    socket.on("submit_result", (data) => {
      socket.to(data._id).emit("onSubmitResult", data); // Gửi vào room có chứa id của presentation
    });
    socket.on("updatePresentation", (data) => {
      socket.to(data._id).emit("onUpdatePresentation", data);
    });

    socket.on("sentQuestion", (data) => {
      socket.to(data._id).emit("onReceiveQuestion", data.data);
    });
    socket.on("updateQuestion", (data) => {
      socket.to(data._id).emit("onUpdateQuestion", data.data);
    });

    socket.on("sentMessage", (data) => {
      socket.to(data._id).emit("onReceiveMessage", data);
    });
    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
      console.log("A user disconnected");
    });

    socket.on("enterGroup", (data) => {
      console.log("enter group" + data);
      socket.join(data);
    });
    socket.on("playPresentation", (data) => {
      socket.to(data._id).emit("onPlayPresentation", {
        _id: data.presentationID,
        name: data.name,
      });
    });
    socket.on("pausePresentation", (data) => {
      socket.to(data._id).emit("onPausePresentation");
    });
  });
};
