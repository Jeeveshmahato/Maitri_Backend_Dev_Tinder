const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const rozarpayInstance = require("../utiles/rozarpay");
const Payment = require("../Model/payment");
const membershipAmoun = require("../utiles/constant");
const payment = require("../Model/payment");
const User = require("../Model/User");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email, _id } = req.user;
    console.log(req.user);
    const order = await rozarpayInstance.orders.create({
      amount: membershipAmoun[membershipType] * 100,
      // amount: "7000",
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: firstName,
        lastName: lastName,
        email,
        membershipType,
        userId: _id,
      },
    });
    console.log(order);
    console.log(
      "Membership Type Amount:",
      membershipType[req.body.membershipType]
    );
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const newPayment = await payment.save();
    res.json({ ...newPayment.toJSON(), keyId: process.env.ROZAR_SECRET_ID });
  } catch (error) {
    console.log(error);
    res.status(400).send("payent Created Unsuccessfully");
  }
});
paymentRouter.post("/payment/webhook", userAuth, async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isValid = await validateWebhookSignature(
      JSON.stringify(req.body),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isValid) {
      console.log("Error in webhook");
      return res.json({ msg: "Webhook is problem" });
    }
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User Save");
    await user.save();
    return res.status(200).json({ msg: "Webhookreceived sucessfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  console.log(user);
  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});
// paymentRouter.post("/premium/userVerify", userAuth, async (req, res) => {
//   const { userId, isPremium } = req.user;
//   await User.findByIdAndUpdate(userId, isPremium);
//   return res.status(200).json({ msg: "User is Premium now sucessfully" });
// });
paymentRouter.post("/premium/userVerify", userAuth, async (req, res) => {
  try {
    const { userId, isPremium } = req.body;

    if (!userId || typeof isPremium !== "boolean") {
      return res.status(400).json({ msg: "Invalid data provided" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isPremium: isPremium },
      // { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User is now premium", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = paymentRouter;
