const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{Value} is not correct`,
      },
    },
  },
  { timestamps: true }
);
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send request to yourself");
  }
  next();
});
const connectionRequestModel = new mongoose.model(
  "connectionModel",
  connectionRequestSchema
);
module.exports = connectionRequestModel;
