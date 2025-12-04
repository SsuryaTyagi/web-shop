const express = require("express");
const passport = require("passport");
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



// LOGIN ROUTE
googleAuthenticator.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);



// CALLBACK ROUTE
googleAuthenticator.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173",
    failureRedirect: "/login",
  })
);

module.exports = googleAuthenticator;