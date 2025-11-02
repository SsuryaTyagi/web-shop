const express = require('express');
const UserModel = require('../Models/user.js');
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { name, number, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const registerUser = await UserModel.create({
      name,
      number,
      email,
      password,
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

module.exports = authRouter;
