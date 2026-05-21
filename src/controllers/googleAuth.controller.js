const UserModel = require("../Models/user");

const googleCallback = async (req, res) => {
  try {
    const googleUser = req.user;
    const mode = req.query.state || "login";
    const googleEmail = googleUser.emails[0].value;

    let user = await UserModel.findOne({ googleId: googleUser.id });

    if (!user) {
      user = await UserModel.findOne({ email: googleEmail });
      if (user) {
        user.googleId = googleUser.id;
        await user.save();
      }
    }

    if (mode === "login" && !user) {
      return res.redirect(
        "https://web-shop-frontend.vercel.app/login?error=not-registered"
      );
    }

    if (!user) {
      user = await UserModel.create({
        googleId: googleUser.id,
        name: googleUser.displayName,
        email: googleEmail,
        number: null,
        address: null,
        password: null,
      });

      const token = await user.jwtUserAuthenticationToken();
      // ✅ Naya user → complete-profile pe bhejo
      return res.redirect(
        `https://web-shop-frontend.vercel.app/complete-profile?token=${token}`
      );
    }

    const token = await user.jwtUserAuthenticationToken();
    // ✅ Cookie nahi — URL mein token bhejo
    return res.redirect(
      `https://web-shop-frontend.vercel.app?token=${token}`
    );

  } catch (err) {
    console.error("Google Auth Error:", err.message);
    return res.redirect(
      "https://web-shop-frontend.vercel.app/login?error=server-error"
    );
  }
};

module.exports = { googleCallback };