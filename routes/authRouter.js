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

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordTrue = bcrypt.compare(password, user.password);

    if (!passwordTrue) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ "email":user.email},process.env.JWT_TOKEN_SECRET,  { expiresIn: "2d" } );
    res.cookie("token",token,{
       httpOnly: true,
       secure:true ,
       sameSite:"None",
       path: "/",
    })
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
