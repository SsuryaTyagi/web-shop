const UserModel = require("../Models/user.js");
const bcrypt = require("bcrypt");
 
// ─── REGISTER ──────────────────────────────────────────────
const RegisterController = async (req, res) => {
  try {
    const { name, number, email, password, address } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
 
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const newUser = await UserModel.create({
      name,
      number,
      email,
      password: hashedPassword,
      address,
    });
 
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
 
// ─── LOGIN ─────────────────────────────────────────────────
const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 
    const isPasswordCorrect = await user.checkForValidPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }
 
    const token = await user.jwtUserAuthenticationToken();
 
    const isProd = process.env.NODE_ENV === "production";
 
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });
 
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
 
// ─── LOGOUT ────────────────────────────────────────────────
const LogoutController = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
 
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
 
  return res.status(200).json({ message: "Logged out successfully" });
};
 
module.exports = { RegisterController, LoginController, LogoutController };
