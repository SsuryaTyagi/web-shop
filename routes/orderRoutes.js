const express = require("express");
const OrderCreate = require("../Models/Order");

const OrderRoutes = express.Router();

OrderRoutes.post("/create", async (req, res) => {
  const { user, items, order_total, payment_id } = req.body;
  try {
    if (items === ""&&user === "") {
      return res.status(500).json({
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
    const email = req.user.email;

    const order = await OrderCreate.find({ email }).sort({ createdAt: -1 });
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
