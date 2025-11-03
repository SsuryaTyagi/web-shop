const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoConnection = require("./config/db");

const menuRoutes = require("./routes/menuRoutes");
const bestRoutes = require("./routes/bestRoutes");
const authRouter = require("./routes/authRouter");

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

// ✅ CORS fix
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://web-shop-nine-zeta.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static("public"));

// ✅ Routes
app.use("/", menuRoutes);
app.use("/", bestRoutes);
app.use("/", authRouter);

app.get("/", (req, res) => {
  res.send("Backend running!");
});

const port = process.env.PORT || 8000;
MongoConnection().then(() => {
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
