const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  order: {
    type: String,
  },
  order_total: {
    type: String,
  },
  order_id: {
    type: String,
  },
},
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);