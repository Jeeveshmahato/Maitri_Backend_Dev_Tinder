const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const rozarpayInstance = require("../utiles/rozarpay");
const Payment = require("../Model/payment");
const membershipAmoun = require("../utiles/constant");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
      const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await rozarpayInstance.orders.create({
      amount: membershipAmoun[membershipType]*100,
      // amount: "7000",
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        membershipType: membershipType,
      },
    });
    console.log(order);
    console.log("Membership Type Amount:", membershipType[req.body.membershipType]);
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
module.exports = paymentRouter;
