const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  name: { type: String, required: true },
  number: { type: Number, default: null },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String, default: null },
  address: { type: String, default: null },

  verified: { type: Boolean, default: false },

  verificationToken: { type: String, default: null },
});

// ✅ Google user ka password null hoga — hash mat karo
UserSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkForValidPassword = async function (passwordByReqBody) {
  if (!this.password) return false;
  return bcrypt.compare(passwordByReqBody, this.password);
};

UserSchema.methods.jwtUserAuthenticationToken = async function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role }, // added role
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "2d" }
  );
};

const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
