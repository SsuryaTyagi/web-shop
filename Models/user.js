const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  number: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
    abbaddress: {
    type: String,
    require: true,
  }
});
UserSchema.methods.checkForValidPassword = async function (passwordByReqBody) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(
    passwordByReqBody,
    user.password
  );

  return isPasswordValid;
};
UserSchema.methods.jwtUserAuthenticationToken = async function () {
  const user = this;

  const token = await jwt.sign({ id: user._id, email: user.email }, process.env.JWT_TOKEN_SECRET, { expiresIn: "2d" });

  return token;
};

const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
