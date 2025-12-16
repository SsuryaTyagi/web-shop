const express = require("express");
const OrderCreate = require("../Models/Order");

const OrderRoutes = express.Router();

OrderRoutes.post("/create", async (req, res) => {
  const { user, items, order_total, payment_id } = req.body;
  try {
    if (!user || !items || items.length === 0) {
      return res.status(400).json({
        message: "Enter full detail...",
      });
    }

    const order = await OrderCreate.create({
      user,
      items,
      order_total,
      payment_id,
    });

    return res.status(201).json({
      message: "Order succesfully create",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
OrderRoutes.post("/orderDetails", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const order = await OrderCreate.find({
      email: email,
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fatch orders...",
    });
  }
});
module.exports = OrderRoutes;
