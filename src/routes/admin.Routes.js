// src/routes/admin.Routes.js
const { Router } = require("express");
const { adminAuth } = require("../middlewares/adminAuth");
const { userAuth } = require("../middlewares/auth.js");
const { getOrders, updateOrderStatus } = require("../controllers/adminOrder.Controller.js");
const { getDashboardStats } = require("../controllers/adminDashboard.Controller.js");

const adminRoutes = Router();

adminRoutes.get("/admin/orders", userAuth, adminAuth, getOrders);
adminRoutes.patch("/admin/orders/:orderId/status", userAuth, adminAuth, updateOrderStatus); // ✅ new
adminRoutes.get("/admin/dashboard-stats", userAuth, adminAuth, getDashboardStats);

module.exports = adminRoutes;