const UserModel = require("../Models/user");

const googleCallback = async (req, res) => {
  try {
    const googleUser = req.user;
    const mode = req.query.state || "login";
    const googleEmail = googleUser.emails[0].value;

    console.log("=== GOOGLE CALLBACK ===");
    console.log("Mode:", mode);
    console.log("Google ID:", googleUser?.id);
    console.log("Email:", googleEmail);

    // ✅ Pehle googleId se dhundo
    let user = await UserModel.findOne({ googleId: googleUser.id });

    // ✅ Nahi mila toh email se dhundo (purane users ke liye)
    if (!user) {
      user = await UserModel.findOne({ email: googleEmail });

      if (user) {
        user.googleId = googleUser.id; // googleId update karo
        await user.save();
        console.log("✅ GoogleId updated:", googleEmail);
      }
    }

    console.log("User found in DB:", user ? user.email : "NOT FOUND");

    if (mode === "login" && !user) {
      console.log("❌ Login failed — user not registered");
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
      console.log("✅ New user created:", user.email);
    }

    const token = await user.jwtUserAuthenticationToken();
    console.log("✅ Token generated");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    console.log("✅ Cookie set — redirecting");

    return res.redirect("https://web-shop-frontend.vercel.app");

  } catch (err) {
    console.error("❌ Google Auth Error:", err.message);
    return res.redirect(
      "https://web-shop-frontend.vercel.app/login?error=server-error"
    );
  }
};

module.exports = { googleCallback };