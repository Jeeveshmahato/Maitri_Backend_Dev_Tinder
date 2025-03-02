const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Model/User");

authRouter.post("/sigup", async (req, res) => {
  const { firstName, lastName, email, password, skills, age, gender } =
    req.body;
  const encrptpass = await bcrypt.hash(password, 10);
  console.log(encrptpass);

  const user = new User({
    firstName,
    lastName,
    email,
    password: encrptpass,
    skills,
    age,
    gender,
  });
  try {
    await user.save();
    res.send("User Created Successfully");
  } catch (error) {
    res.status(400).send("User Created Unsuccessfully");
  }

  console.log(req.body);
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const finduser = await User.findOne({ email: email });
    if (!finduser) {
      throw new Error("Invalid email");
    }
    const token = await finduser.getjwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // cookies expires in 7 days
    });
    const passCheck = await finduser.bcryptfun(password);
    if (!passCheck) {
      throw new Error("Invalid password");
    }
    res.send("Logged in Successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.send("Logged out Successfully");
});
module.exports = authRouter;
