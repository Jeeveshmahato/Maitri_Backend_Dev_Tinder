const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../Model/chat");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};
const initailizeSocket = (server) => {
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
      console.log(`Active rooms:`, socket.rooms);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, lastName, targetUserId, text ,img_Url }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(roomId);
          console.log(firstName + " " + text);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
            firstName,
            lastName,
            img_Url
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text ,img_Url });
        } catch (error) {
          console.log(error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initailizeSocket;
