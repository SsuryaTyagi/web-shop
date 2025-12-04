const express = require("express");
const passport = require("passport");
const UserModel = require("../Models/user.js");
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

// 1️⃣ START GOOGLE LOGIN  (yaha mode ko SESSION me daalenge)
googleAuthenticator.get(
  "/auth/google",
  (req, res, next) => {
    // ?mode=login / register se mode leke session me dal diya
    req.session.mode = req.query.mode || "login";
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ CALLBACK
googleAuthenticator.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const googleUser = req.user;
    const mode = req.session.mode || "login";  // yaha se mode aayega

    // Ek baar use ho gaya to session se hata bhi sakte ho
    delete req.session.mode;

    let user = await UserModel.findOne({ googleId: googleUser.id });

    // LOGIN FLOW
    if (mode === "login") {
      if (!user) {
        return res.redirect(
          "https://web-shop-frontend.vercel.app/login?error=not-registered"
        );
      }

      const token = user.jwtUserAuthenticationToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // domain: "web-shop-frontend.vercel.app",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });


      return res.redirect("https://web-shop-frontend.vercel.app");
    }

    // REGISTER FLOW
    if (mode === "register") {
      if (!user) {
        user = await UserModel.create({
          googleId: googleUser.id,
          email: googleUser.emails[0].value,
          name: googleUser.displayName,
        });
      }

      const token = user.jwtUserAuthenticationToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return res.redirect("https://web-shop-frontend.vercel.app");
    }

    // safety: agar mode kuch aur hua to
    return res.redirect("https://web-shop-frontend.vercel.app/login?error=unknown-mode");
  }
);

module.exports = googleAuthenticator;
