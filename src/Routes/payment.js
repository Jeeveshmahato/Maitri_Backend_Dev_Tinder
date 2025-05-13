const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const rozarpayInstance = require("../utiles/rozarpay");
const Payment = require("../Model/payment");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await rozarpayInstance.orders.create({
      amount: "7000",
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: "testfirst",
        lastName: "testlast",
        emailId: "testemail",
        membershipType: "membershipType",
      },
    });
    console.log(order);
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
    res.json({ newPayment });
  } catch (error) {
    console.log(error);
    res.status(400).send("payent Created Unsuccessfully");
  }
});
module.exports = paymentRouter;
