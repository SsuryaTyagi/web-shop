const express = require("express");
const { userAuth } = require("../Middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, (req, res) => {
  const { password, __v, ...safeUser } = req.user.toObject();
  res.status(200).json({ user: safeUser });
});

module.exports = profileRouter;
