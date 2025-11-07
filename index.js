const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
require("dotenv").config();
const MongoConnection = require("./config/db");

const menuRoutes = require("./routes/menuRoutes");
const bestRoutes = require("./routes/bestRoutes");
const authRouter = require("./routes/authRouter");
const router = require("./routes/verifyRouter");

const app = express();
app.use(cors({
  origin: [
    "https://web-shop-frontend-l7cs.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
  
}));



app.use(express.json());
app.use(bodyParser.json());


app.use(express.static("public"));

// ✅ Routes
app.use(cookieParser());
app.use("/", menuRoutes);
app.use("/", bestRoutes);
app.use("/", authRouter);
app.use("/",router)

app.get("/", (req, res) => {
  res.send("Backend running!");
});

const port = process.env.PORT || 8000;
MongoConnection().then(() => {
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`http://localhost:${port}`));
});
