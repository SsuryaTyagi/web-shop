const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    dis: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create and export the Category model
module.exports = mongoose.model("Category", categorySchema);