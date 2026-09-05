const mongoose = require("mongoose");

const ORDER_STATUSES = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

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
        quantity: Number,
      },
    ],

    order_total: Number,
    payment_id: String,
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;