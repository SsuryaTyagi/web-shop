const express = require("express");
const router = express.Router();
const {
  RegisterController,
  VerifyEmailController,
  LoginController,
  LogoutController,
  getMeController,
} = require("../controllers/Auth.controller");
const { userAuth } = require("../Middlewares/auth.js");

router.post("/register", RegisterController);
router.get("/auth/verify-email/:token", VerifyEmailController);
router.post("/login", LoginController);
router.get("/get-Me", userAuth, getMeController);
router.post("/logout", LogoutController);
router.get("/verify-email/:token", VerifyEmailController);

module.exports = router;
