const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://jeeveshatwork:RTntEvE5Gt4hHW2M@namastenode.kcy1y.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode/devTinder"
  );
};
module.exports = connectDB;
