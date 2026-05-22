const OrderModel = require("../Models/Order");
 
// ─── CREATE ORDER ──────────────────────────────────────────
const CreateOrderController = async (req, res) => {
  try {
    const { user, items, order_total, payment_id } = req.body;
 
    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }
 
    if (!payment_id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }
 
    const order = await OrderModel.create({
      user,
      items,
      order_total,
      payment_id,
    });
 
    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
 
  } catch (error) {
    console.error("Order Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
 
// ─── GET ORDERS ────────────────────────────────────────────
const GetOrderController = async (req, res) => {
  try {
    const { email } = req.body;
 
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
 
    const orders = await OrderModel.find({ "user.email": email })
      .sort({ createdAt: -1 });
 
    return res.status(200).json({ success: true, order: orders });
 
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};
 
module.exports = { CreateOrderController, GetOrderController };