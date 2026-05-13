const express = require("express");
const router = express.Router();
const {
  RegisterController,
  LoginController,
  LogoutController,
} = require("../controllers/auth.controller");
 
router.post("/register", RegisterController);
router.post("/login",    LoginController);
router.post("/logout",   LogoutController);
 
module.exports = router;