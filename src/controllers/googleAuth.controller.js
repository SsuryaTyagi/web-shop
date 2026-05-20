const UserModel = require("../Models/user");

const googleCallback = async (req, res) => {
  try {
    const googleUser = req.user;
    const mode = req.query.state || "login";

    let user = await UserModel.findOne({ googleId: googleUser.id });

    // LOGIN — user registered nahi hai
    if (mode === "login" && !user) {
      return res.redirect(
        "https://web-shop-frontend.vercel.app/login?error=not-registered"
      );
    }

    // REGISTER — naya user banao
    if (!user) {
      user = await UserModel.create({
        googleId: googleUser.id,
        name: googleUser.displayName,
        email: googleUser.emails[0].value,
        number: null,
        address: null,
        password: null,
      });
    }

    // Token banao
    const token = await user.jwtUserAuthenticationToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("https://web-shop-frontend.vercel.app");

  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.redirect(
      "https://web-shop-frontend.vercel.app/login?error=server-error"
    );
  }
};

module.exports = { googleCallback };