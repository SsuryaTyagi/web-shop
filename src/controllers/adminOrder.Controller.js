const OrderModel = require("../models/order.Model");
const { ORDER_STATUSES } = require("../models/order.Model");

// ─── GET ORDERS (admin) ────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    let { date } = req.query;

    let query = {};

    if (date && date !== "all") {
      const startOfDay = new Date(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.createdAt = { $gte: startOfDay, $lt: endOfDay };
    }
    // if date is missing or "all", no date filter is applied — returns every order

    // NOTE: `user` is an embedded object on the order document, not a ref,
    // so no .populate() is needed — o.user.name / o.user.number / o.user.address
    // are already present on each order.
    const orders = await OrderModel.find(query).sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.order_total, 0);

    res.status(200).json({
      date: date || "all",
      totalOrders,
      totalRevenue,
      orders,
    });
  } catch (error) {
    console.error("Get Orders (admin) Error:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// ─── UPDATE ORDER STATUS (admin) ───────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`,
      });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

module.exports = { getOrders, updateOrderStatus };