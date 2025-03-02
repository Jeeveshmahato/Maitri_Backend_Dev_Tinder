const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequestModel = require("../Model/connectionRequest");
const { connection } = require("mongoose");
const User = require("../Model/User");
const userRequest = express.Router();
const Save_data = "firstName lastName";

userRequest.get("/userrequest/pending", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const findUser = await connectionRequestModel
      .find({
        $or: [
          { toUserId: userId, status: "interested" },
          { fromUserId: userId, status: "interested" },
        ],
      })
      .populate("fromUserId", Save_data)
      .populate("toUserId", Save_data);
    if (findUser.length == 0) {
      throw new Error("No pending request found");
    }

    const data = findUser.map((user) => {
      if (user.fromUserId._id.toString() === userId.toString()) {
        return user.toUserId;
      }
      return user.fromUserId;
    });
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
userRequest.get("/userrequest/accepted", userAuth, async (req, res) => {
  try {
    const LoginUser = req.user;
    const findUser = await connectionRequestModel
      .find({
        $or: [
          { toUserId: LoginUser._id, status: "accepted" },
          { fromUserId: LoginUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", Save_data)
      .populate("toUserId", Save_data);

    if (findUser.length == 0) {
      throw new Error("No accepted request found");
    }
    const data = findUser.map((user) => {
      if (user.fromUserId._id.toString() == LoginUser._id.toString()) {
        return user.toUserId;
      }
      return user.fromUserId;
    });
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
userRequest.get("/feed", userAuth, async (req, res) => {
  try {
    const pageno = req.query.pageno || 1;
    let limit = req.query.limit || 2;
    limit = limit > 50 ? 50 : limit;
    let skip = (pageno - 1) * limit;
    const logedInUser = req.user;
    const connections = await connectionRequestModel
      .find({
        $or: [
          {
            toUserId: logedInUser._id,
          },
          {
            fromUserId: logedInUser._id,
          },
        ],
      })
      .select("fromUserId toUserId");
    const hiddenConnections = new Set();
    connections.forEach((element) => {
      hiddenConnections.add(element.toUserId.toString());
      hiddenConnections.add(element.fromUserId.toString());
    });
    console.log(hiddenConnections);
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenConnections) } },
        {
          _id: { $ne: logedInUser._id },
        },
      ],
    })
      .select(Save_data)
      .skip(skip)
      .limit(limit);
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRequest;
