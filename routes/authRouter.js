const express = require("express");
const UserModel = require("../Models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// REGISTER USER
authRouter.post("/register", async (req, res) => {
  try {
    const { name, number, email, password, address} = req.body;

    if (email === "" && password === "") {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    }
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
      address
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
    const token = await user.jwtUserAuthenticationToken();
    console.log("Generated Token:", token);
    // Set token in cookie

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // domain: "web-shop-frontend.vercel.app",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    // domain: "web-shop-frontend.vercel.app",
    path: "/",  
  });

  return res.json({ message: "Logged out" });
});


module.exports = authRouter;
