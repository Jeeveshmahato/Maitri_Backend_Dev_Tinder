const socket = require("socket.io");
const crypto = require("crypto");

const initailizeSocket = (server) => {
  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
  };
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + "joined Room : " + roomId);
      console.log(roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", ({ firstName, userId,lastName, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(roomId)
      console.log(firstName + " " + text);
      io.to(roomId).emit("messageReceived", { firstName,lastName, text });
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = initailizeSocket;
