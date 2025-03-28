const express = require("express");
const connectionRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const connectionRequestModel = require("../Model/connectionRequest.js");
const User = require("../Model/User.js");

connectionRouter.post(
  "/connection/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const userId = await User.findById(toUserId);
      if (!userId) {
        throw new Error("User not found");
      }
      const AllowedStatus = ["ignored", "interested"];

      if (!AllowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }
      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        throw new Error("Request already sent");
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data =await connectionRequest.save();
      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // );
      // console.log(emailRes);
      res.json({
        message: req.user.firstName + " " + status + " " + userId.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);
connectionRouter.post(
  "/connection/modifystatus/:status/:reqId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const requestId = req.params.reqId;
      const reciverId = req.user._id;
      const user = await User.findById(reciverId);
      if (!user) {
        throw new Error("User not found");
      }
      const AllowedStatus = ["accepted", "rejected"];
      if (!AllowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }
      const exisitUser = await connectionRequestModel.findOne({
        toUserId: reciverId,
        _id: requestId,
        status: "interested",
      });
      if (!exisitUser) {
        throw new Error("No interested request found");
      }
      exisitUser.status = status;
     const data =  await exisitUser.save();
     res.json({ message: "Connection request " + status, data });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = connectionRouter;
