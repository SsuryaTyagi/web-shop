const express = require("express");
const router = express.Router();
const {
  CreateOrderController,
  GetOrderController, 
} = require("../controllers/order.Controller");
const { userAuth } = require("../middlewares/auth");
const { adminAuth } = require("../middlewares/adminAuth");

router.post("/create", CreateOrderController);
router.post("/orderDetails", userAuth, GetOrderController);

module.exports = router;