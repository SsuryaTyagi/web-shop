const express = require("express");
const UserModel = require("../Models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// REGISTER USER
authRouter.post("/register", async (req, res) => {
  try {
    const { name, number, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UserModel.create({
      name,
      number,
      email,
      password: hashedPassword,
    });

    console.log("New user registered:", newUser);

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


// LOGIN USER
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Validate password
    const isPasswordCorrect = await user.checkForValidPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "2d" }
    );
    console.log("Generated Token:", token);
    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure:false,
      // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      sameSite:None,
      domain: ".web-shop-frontend-l7cs.vercel.app",
      priority: "high",
      path: "/",
    });
    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
});


// LOGOUT USER
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    message: "User logged out successfully",
  });
});

module.exports = authRouter;
