const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  address: {
    type: String,
  
  },
});
UserSchema.methods.checkForValidPassword = async function (passwordByReqBody) {
  if (!this.password) return false; // ✅ Google user hai — password nahi
  return bcrypt.compare(passwordByReqBody, this.password);
};
UserSchema.methods.jwtUserAuthenticationToken = async function () {
  const user = this;

  const token = await jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "2d" },
  );

  return token;
};

const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
