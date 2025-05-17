const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid Password");
        }
      },
    },
    img_Url: {
      type: String,
    },
    skills: {
      type: [String],
      minlength: 3,
      maxlength: 10,
    },
    age: {
      type: Number,
      min: 18,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error("Gender must be male, female or other");
        }
      },
    },
  },
  { timestamps: true }
);
userSchema.methods.getjwt = async function () {
  const finduser = this;
  const token = await jwt.sign({ id: finduser._id }, process.env.JWT_SECRET); //token expires in 7days
  return token;
};
userSchema.methods.bcryptfun = async function (passwordInputByUser) {
  const finduser = this;
  const hassPassword = finduser.password;
  const validPassCheck = await bcrypt.compare(
    passwordInputByUser,
    hassPassword
  );
  return validPassCheck;
};
module.exports = mongoose.model("User", userSchema);
