const express = require("express");
const passport = require("passport");
const UserModel = require("../Models/user.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const googleAuthenticator = express.Router();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

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

// STEP 1 — GOOGLE LOGIN START
googleAuthenticator.get(
  "/auth/google",
  (req, res, next) => {
    req.session.mode = req.query.mode || "login"; // save mode
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2 — CALLBACK
googleAuthenticator.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const googleUser = req.user;
    const mode = req.session.mode || "login"; // retrieve mode
    delete req.session.mode;

    let user = await UserModel.findOne({ googleId: googleUser.id });

    // LOGIN MODE
    if (mode === "login") {
      if (!user) {
        return res.redirect(
          "https://web-shop-frontend.vercel.app/login?error=not-registered"
        );
      }
    }

    // REGISTER MODE
    if (!user) {
      user = await UserModel.create({
        googleId: googleUser.id,
        email: googleUser.emails[0].value,
        name: googleUser.displayName,
      });
    }

    // SEND TOKEN
    const token = user.jwtUserAuthenticationToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.redirect("https://web-shop-frontend.vercel.app");
  }
);

module.exports = googleAuthenticator;
