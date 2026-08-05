const UserModel = require("../models/user.Model.js");
const { sendVerificationEmail } = require("../services/email.service.js");
const {
  generateVerificationToken,
  verifyVerificationToken,
} = require("../utils/jwt.utils.js");

const RegisterController = async (req, res) => {
  try {
    const { name, number, email, password, address } = req.body;

    if (!name || !number || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create({
      name,
      number,
      email,
      password,
      address,
      verified: false,
    });

    const verificationToken = generateVerificationToken(email);
    await sendVerificationEmail(email, name, verificationToken);

    return res.status(201).json({
      message: "Registration successful! Please verify your email.",
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

    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const token = await user.jwtUserAuthenticationToken();

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (error) {
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

const VerifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verifyVerificationToken(token);

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "invalid link" });
    }
    if (user.verified) {
      return res.status(400).json({ message: "already verified" });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "link expired" });
    }
    return res.status(400).json({ message: "invalid link" });
  }
};
const getMeController = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("getMeController error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  RegisterController,
  VerifyEmailController,
  LoginController,
  LogoutController,
  getMeController,
};
