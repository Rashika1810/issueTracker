let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "User connected:",
      socket.id
    );

    socket.on(
      "join-user-room",
      (userId) => {
        socket.join(userId);
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "User disconnected:",
        socket.id
      );
    });
  });
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
};