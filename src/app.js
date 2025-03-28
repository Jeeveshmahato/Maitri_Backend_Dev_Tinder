const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./config/database");
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const connectionRouter = require("./Routes/request");
const userRequest = require("./Routes/userRequest");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRequest);

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
