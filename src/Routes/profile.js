const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { validateEditCheck } = require("../utiles/validation.js");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  // console.log("Request body:", req.body); // Log request data
  try {
    if (!validateEditCheck(req)){
      throw new Error("Edit check not valid");
    } 
    const logedInUser = req.user;

    Object.keys(req.body).forEach((k) => {
      logedInUser[k] = req.body[k];
    });
    await logedInUser.save();
    res.send(`${logedInUser.firstName} Profile updated successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
profileRouter.patch("/profile/editpassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const logedInUser = req.user;
    const matchPassword = await bcrypt.compare(currentPassword, logedInUser.password);
    if (!matchPassword) throw new Error("Current Password is wrong");
    const encryptedNewPassword = await bcrypt.hash(newPassword, 10); 

    logedInUser.password = encryptedNewPassword;
    await logedInUser.save();
    res.send(`${logedInUser.firstName} Password updated successfully`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = profileRouter;
