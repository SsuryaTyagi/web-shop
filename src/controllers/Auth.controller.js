const UserModel = require("../Models/user.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 
const { sendVerificationEmail } = require("../services/email.service");

// ─── REGISTER ──────────────────────────────────────────────
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

    const hashedPassword = await bcrypt.hash(password, 10);


    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await UserModel.create({
      name,
      number,
      email,
      password: hashedPassword,
      address,
      verified: false,                  
      verificationToken,                
    });

    
    await sendVerificationEmail(email, name, verificationToken);

    return res.status(201).json({
      message: "Registration successful! Please verify your email.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        verified: newUser.verified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── VERIFY EMAIL ──────────────────────────────────────────
const VerifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      return res.redirect(
        "https://web-shop-frontend.vercel.app/login?error=invalid-link"
      );
    }

   
    user.verified = true;
    user.verificationToken = null; 
    await user.save();

    return res.redirect(
      "https://web-shop-frontend.vercel.app/login?verified=true"
    );

  } catch (error) {
    console.error("Verify Error:", error);
    return res.redirect(
      "https://web-shop-frontend.vercel.app/login?error=server-error"
    );
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
      token: token,
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

module.exports = {
  RegisterController,
  VerifyEmailController,
  LoginController,
  LogoutController,
};