const express = require("express");
const router = express.Router();
const {
  RegisterController,
  VerifyEmailController,
  LoginController,
  LogoutController,
} = require("../controllers/Auth.controller");

router.post("/register", RegisterController);
router.get("/auth/verify-email/:token", VerifyEmailController); // ✅ naya
router.post("/login", LoginController);
router.post("/logout", LogoutController);
router.get("/verify-email/:token", VerifyEmailController)

module.exports = router;