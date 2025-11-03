const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoConnection = require("./config/db");

// ✅ Import routes
const menuRoutes = require('./routes/menuRoutes');
const bestRoutes = require('./routes/bestRoutes');
const authRouter = require("./routes/authRouter");

const app = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

// ✅ Middleware
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  origin: [
    "https://web-shop-frontend-l7cs.vercel.app",
    "https://web-shop-nine-zeta.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.send('Backend running!');
});

// ✅ Use the new routes
app.use('/', menuRoutes);
app.use('/', bestRoutes);
app.use("/", authRouter);

// ✅ Start server
MongoConnection()
  .then(() => {
    console.log('MongoDB connection established');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB Connection Failed');
    console.log(err);
  });
