const express = require('express');
const UserModel = require('../Models/user.js');
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { name, number, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
      // hash password 
     const hashpassword = await bcrypt.hash(password,10)


    const registerUser = await UserModel.create({
      name,
      number,
      email,
      password:hashpassword
    });

    console.log('User created:', registerUser);
    res.status(201).json({
      message: 'User registered successfully',
      user: registerUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received email:", email);
    console.log("Received password:", password);

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password in DB:", user.password);

    const passwordTrue = await user.checkForValidPassword(password);

    // console.log("Password compare result:", passwordTrue);
    
    if (!passwordTrue) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token =  jwt.sign({ email: user.email, id: user._id },process.env.JWT_TOKEN_SECRET,{ expiresIn: "2d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    // Send response
    return res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
});

//logout route 
authRouter.post("/logout",(req,res)=>{
  res.clearCookie('token');
  res.status(200).json({
    message:"User logged out successfully"
  })
})

    
  

module.exports = authRouter;
