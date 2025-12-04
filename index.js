const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
require("dotenv").config();
const MongoConnection = require("./config/db");
const session = require("express-session");
const passport = require("passport");


const menuRoutes = require("./routes/menuRoutes");
const bestRoutes = require("./routes/bestRoutes");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const sendMaile = require("./routes/contactMail");
const googleAuthenticator = require("./routes/googleAuth");

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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      sameSite: "none",
      secure: true,
    }
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());


app.use(express.static("public"));

// ✅ Routes
app.use("/", menuRoutes);
app.use("/", bestRoutes);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", sendMaile);
app.use("/",googleAuthenticator)



app.get("/", (req, res) => {
  res.send("Backend running!");
});

const port = process.env.PORT || 8000;
MongoConnection().then(() => {
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`http://localhost:${port}`));
});
