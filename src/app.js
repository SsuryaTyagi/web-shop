require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const app = express();
app.set("trust proxy", 1);


const allowedOrigins = [
  "https://web-shop-frontend.vercel.app",
  "http://localhost:5173", // for local dev
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());

// app.use(express.static("public"));

// ✅ Route imports
const authRouter = require("./routes/auth.Routes");
const menuRouter = require("./routes/menu.Routes");
const profileRouter = require("./routes/profile.Routes");
const sendMaile = require("./routes/contactMail.Routes");
const googleAuthenticator = require("./routes/googleAuth.Routes");
const paymentRouter = require("./routes/payment.Routes");
const OrderRoutes = require("./routes/order.Routes");
const MenuCategory = require("./routes/category.Routes");

// ✅ Routes
app.use("/", authRouter);
app.use("/", menuRouter);
app.use("/", profileRouter);
app.use("/", sendMaile);
app.use("/auth", googleAuthenticator);
app.use("/api/payment", paymentRouter);
app.use("/", OrderRoutes);
app.use("/", MenuCategory);

app.get("/", (req, res) => {
  res.send("Backend running!");
});

module.exports = app;