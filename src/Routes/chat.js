const express = require("express");
const { Chat } = require("../Model/chat");
const { userAuth } = require("../middleware/auth");

const chatRouter = express.Router();
chatRouter.get(
  "/chat/:targetUserId",
  userAuth,
  async (req, res) => {
    //   can be change the UserID
    const { targetUserId } = req.params;
    const userId = req.user._id;
    try {
      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      }).populate({
        path: "messages.senderId",
        select: "firstname lastname",
      });
      if (!chat) {
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        });
        await chat.save();
      }
      res.json(chat);
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = chatRouter;
