require("dotenv").config();

const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./config/database");
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const connectionRouter = require("./Routes/request");
const userRequest = require("./Routes/userRequest");
const paymentRouter = require("./Routes/payment");
const http = require("http");
const cors = require("cors");
const initailizeSocket = require("./utiles/Socket");
const chatRouter = require("./Routes/chat");
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
app.use("/", paymentRouter);
app.use("/", chatRouter);
require("./utiles/cornJob");
const server = http.createServer(app);
initailizeSocket(server);
connectDB()
  .then(() => {
    console.log("MongoDB Connected...");
    server.listen(parseInt(process.env.PORT), () => {
      console.log(`Server running on port ${parseInt(process.env.PORT)}...`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
