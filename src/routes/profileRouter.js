const express = require("express");
const { userAuth } = require("../Middlewares/auth");

const profileRouter = express.Router();

profileRouter.post("/profile", userAuth, (req, res) => {
  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
});

module.exports = profileRouter;
