const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      name: String,
      email: String,
      number: String,
      address: String,
    },

    items: [
      {
        name: String,
        price: Number,
        img: String,
        qty: Number,
      },
    ],

    order_total: Number,
    payment_id: String,
    status: {
      type: String,
      default: "Delivered",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
