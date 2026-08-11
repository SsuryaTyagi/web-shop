const express = require("express");
const passport = require("../config/passport");
const { googleCallback } = require("../controllers/googleAuth.Controller");

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
  }),
  googleCallback
);

module.exports = router;