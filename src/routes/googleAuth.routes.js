const express = require("express");
const passport = require("../config/passport");
const { googleCallback } = require("../controllers/googleAuth.controller");

const router = express.Router();


router.get("/google", (req, res) => {
  const mode = req.query.mode || "login";
  return passport.authenticate("google", {
    scope: ["profile", "email"],
    state: mode,
    session: false,
  })(req, res);
});


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

module.exports = router;