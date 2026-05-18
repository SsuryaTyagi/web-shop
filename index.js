const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
require("dotenv").config();
const MongoConnection = require("./src/config/db");
const session = require("express-session");
const passport = require("passport");


const menuRoutes = require("./src/routes/menuRoutes");
const bestRoutes = require("./src/routes/bestRoutes");
const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const sendMaile = require("./src/routes/contactMail");
const googleAuthenticator = require("./src/routes/googleAuth");
const paymentRouter = require("./src/routes/payment");
const OrderRoutes = require("./src/routes/orderRoutes");

const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: [
    "https://web-shop-frontend.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

// SESSION
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,

//     cookie: {
//       sameSite: "none",
//       secure: true,
//     }
//   })
// );


app.use(passport.initialize());
// app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());


// app.use(express.static("public"));

// ✅ Routes
app.use("/", menuRoutes);
app.use("/", bestRoutes);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", sendMaile);
app.use("/",googleAuthenticator);
app.use("/api/payment", paymentRouter);
app.use("/", OrderRoutes);



// app.get("/", (req, res) => {
//   res.send("Backend running!");
// });

const port = process.env.PORT || 8000;
MongoConnection().then(() => {
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`http://localhost:${port}`));
});
