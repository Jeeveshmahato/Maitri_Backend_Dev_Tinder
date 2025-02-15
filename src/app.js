const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./config/database");
const User = require("./Model/User");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
const validatetoupdate = require("./utiles/validation.js");
const { userAuth } = require("./middleware/auth.js");

app.get("/users", async (req, res) => {
  const userEmail = req.body.email;
  try {
    // const cookie = req.cookies['cookies-name'];
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      throw new Error("No token, authorization denied");
    }
    const decoded = jwt.verify(token, "shhhhh");
    console.log(decoded);
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
      return;
    } else {
      res.send(user);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
app.get("/id", async (req, res) => {
  const id = req.body._id;
  try {
    const userid = await User.findById({ _id: id });
    if (!userid) {
      res.status(404).send("User not found");
      return;
    } else {
      res.send(userid);
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
app.delete("/delete", async (req, res) => {
  const id = req.body._id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
app.patch("/update/:userid", async (req, res) => {
  const userid = req.params?.userid;
  const { _id, ...data } = req.body;

  try {
    validatetoupdate(req);

    const user = await User.findOneAndUpdate({ _id: userid }, data, {
      new: true, // Return the updated document
      runValidators: true,
    });
    console.log(user);
    if (!user) {
      res.status(404).send("User not found");
      return;
    } else {
      res.send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
});

app.get("/getusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
connectDB()
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(5000, () => {
      console.log("Server running on port 5000...");
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
