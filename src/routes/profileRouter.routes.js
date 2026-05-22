const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");

const profileRouter = express.Router();

profileRouter.get("/profile", async (req, res) => {
  try {
    // Cookie se token lo
    let token = req.cookies?.token;

    // Header se token lo
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, __v, ...safeUser } = user.toObject();
    return res.status(200).json({ user: safeUser });

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = profileRouter;