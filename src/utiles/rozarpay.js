const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.ROZAR_SECRET_ID,
  key_secret: process.env.ROZAR_SECRET_KEY,
});
module.exports = instance