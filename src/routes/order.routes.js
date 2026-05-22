const express = require("express");
const router = express.Router();
const {
  CreateOrderController,
  GetOrderController,
} = require("../controllers/order.controller");
 
router.post("/create",       CreateOrderController);
router.post("/orderDetails", GetOrderController);
 
module.exports = router;
