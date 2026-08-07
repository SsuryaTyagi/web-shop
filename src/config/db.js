require("dotenv").config();
const mongoose = require("mongoose");


console.log("MONGO_CONN exists:", !!process.env.MONGO_CONN);
console.log("MONGO_CONN length:", process.env.MONGO_CONN?.length);
let isConnected = false;

const MongoConnection = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_CONN, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    isConnected = false;
    console.error("MongoDB error:", err.message);
    throw err;
  }
};

module.exports = MongoConnection;