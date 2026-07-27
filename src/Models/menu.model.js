const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    price_m: {
      type: Number,
    },
    price_l: {
      type: Number,
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);