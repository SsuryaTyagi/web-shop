// src/controllers/adminDashboard.Controller.js
const orderModel = require("../models/order.Model");
const userModel = require("../models/user.Model"); // ⚠️ confirm this path/filename matches yours

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.toISOString().slice(0, 10));
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = todayStart;

    // Today vs yesterday
    const todaysOrders = await orderModel.find({ createdAt: { $gte: todayStart, $lt: todayEnd } });
    const yesterdaysOrders = await orderModel.find({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } });

    const totalOrdersToday = todaysOrders.length;
    const revenueToday = todaysOrders.reduce((sum, o) => sum + o.order_total, 0);
    const totalOrdersChange = pctChange(totalOrdersToday, yesterdaysOrders.length);
    const revenueChange = pctChange(
      revenueToday,
      yesterdaysOrders.reduce((sum, o) => sum + o.order_total, 0)
    );

    // Pending orders
    const pendingOrders = await orderModel.countDocuments({ status: "Pending" });
    const pendingYesterday = await orderModel.countDocuments({
      status: "Pending",
      createdAt: { $lt: todayStart },
    });
    const pendingChange = pctChange(pendingOrders, pendingYesterday);

    // Users
    const totalUsers = await userModel.countDocuments();
    const usersAWeekAgo = await userModel.countDocuments({
      createdAt: { $lt: new Date(now - 7 * 24 * 60 * 60 * 1000) },
    });
    const usersChange = pctChange(totalUsers, usersAWeekAgo);

    // Last 7 days revenue/orders chart
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const last7DaysOrders = await orderModel.find({ createdAt: { $gte: sevenDaysAgo, $lt: todayEnd } });

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const revenue7Days = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(sevenDaysAgo);
      dayStart.setDate(dayStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayOrders = last7DaysOrders.filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd);

      revenue7Days.push({
        day: dayLabels[dayStart.getDay()],
        revenue: dayOrders.reduce((sum, o) => sum + o.order_total, 0),
        orders: dayOrders.length,
      });
    }

    res.status(200).json({
      totalOrdersToday,
      totalOrdersChange,
      revenueToday,
      revenueChange,
      pendingOrders,
      pendingChange,
      totalUsers,
      usersChange,
      revenue7Days,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

module.exports = { getDashboardStats };