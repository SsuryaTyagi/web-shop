const orderModel = require("../models/order.Model");

const getOrders = async (req, res) => {
  try {
    let { date } = req.query;
    console.log("HIT getOrders",req.query);

    if (!date) {
      date = new Date().toISOString().slice(0, 10); // e.g. "2026-08-08"
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const orders = await orderModel.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

module.exports = { getOrders };