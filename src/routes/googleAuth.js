const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const UserModel = require("../Models/user.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleAuthenticator = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://web-shop-api.vercel.app/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

// STEP 1 — START LOGIN
googleAuthenticator.get("/auth/google", (req, res) => {
  const mode = req.query.mode || "login";

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    state: mode, // pass mode as URL state
    session: false,
  })(req, res);
});

// STEP 2 — CALLBACK
googleAuthenticator.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const googleUser = req.user;
    const mode = req.query.state || "login"; // get mode

    let user = await UserModel.findOne({ googleId: googleUser.id });

    // LOGIN MODE
    if (mode === "login" && !user) {
      return res.redirect(
        "https://web-shop-frontend.vercel.app/login?error=not-registered",
      );
    }

    // REGISTER MODE
    if (!user) {
      const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        googleId: { type: String, default: null }, // ✅ add karo
        number: { type: Number, required: false, default: null }, // ✅
        address: { type: String, required: false, default: null }, // ✅
        password: { type: String, default: null }, // ✅ Google users ka password nahi hoga
      });
    }

    // SEND TOKEN COOKIE
    const token = await user.jwtUserAuthenticationToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("https://web-shop-frontend.vercel.app");
  },
);

module.exports = googleAuthenticator;
