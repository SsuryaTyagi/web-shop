const express = require("express");
const router = express.Router();
const {
  CreateOrderController,
  GetOrderController,
  GetAllOrdersController, 
} = require("../controllers/order.controller");
const { userAuth } = require("../Middlewares/auth");
const { adminAuth } = require("../Middlewares/adminAuth");

router.post("/create", CreateOrderController);
router.post("/orderDetails", userAuth, GetOrderController);
router.get("/admin/orders", userAuth, adminAuth, GetAllOrdersController);

module.exports = router;