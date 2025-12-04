const express = require("express");
const passport = require("passport");
const { find } = require("../Models/user");
const UserModel = require("../Models/user.js");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleAuthenticator = express.Router();

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

googleAuthenticator.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {

    const googleUser = req.user;
    
    // mode detect
    const mode = req.query.mode; // "login" or "register"

    let user = await UserModel.findOne({ googleId: googleUser.id });

    // CASE 1 — LOGIN PAGE LOGIC
    if (mode === "login") {

      if (!user) {
        // user nahi mila -> login allowed nahi
        return res.redirect("https://web-shop-frontend.vercel.app/login?error=not-registered");
      }

      // user mila -> token send
      const token = user.jwtUserAuthenticationToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return res.redirect("https://web-shop-frontend.vercel.app");
    }

    //CASE 2 — REGISTER PAGE LOGIC
    if (mode === "register") {

      if (!user) {
        // NEW USER REGISTER
        user = await UserModel.create({
          googleId: googleUser.id,
          email: googleUser.emails[0].value,
          name: googleUser.displayName,
        });
      }

      // token send
      const token = user.jwtUserAuthenticationToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return res.redirect("https://web-shop-frontend.vercel.app");
    }
  }
);


module.exports = googleAuthenticator;
