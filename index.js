require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const MongoConnection = require("./src/config/db");
const session = require("express-session");
const passport = require("./src/config/passport");



const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: [
    "https://web-shop-frontend.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(async (req, res, next) => {
  try {
    await MongoConnection();
    next();
  } catch (err) {
    return res.status(500).json({ message: "Database connection failed" });
  }
});


// app.use(express.static("public"));

const menuRouter = require("./src/routes/menu.routes");
const authRouter = require("./src/routes/auth.Routes");
const profileRouter = require("./src/routes/profileRouter.routes");
const sendMaile = require("./src/routes/contactMail.routes");
const googleAuthenticator = require("./src/routes/googleAuth.routes");
const paymentRouter = require("./src/routes/payment.routes");
const OrderRoutes = require("./src/routes/order.routes");
const MenuCategory = require("./src/routes/Category.routes")

// ✅ Routes
app.use("/", authRouter);
app.use("/", menuRouter);
app.use("/", profileRouter);
app.use("/", sendMaile);
app.use("/auth", googleAuthenticator);
app.use("/api/payment", paymentRouter);
app.use("/", OrderRoutes);
app.use("/",MenuCategory)




app.get("/", (req, res) => {
  res.send("Backend running!");
});


const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

// Vercel ke liye — app export karo
module.exports = app;
