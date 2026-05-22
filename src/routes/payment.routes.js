const express = require("express");
const router = express.Router();
const {
  CreateOrderController,
  VerifyPaymentController,
} = require("../controllers/payment.controller");
 
router.post("/create-order", CreateOrderController);
router.post("/verify",       VerifyPaymentController);
 
module.exports = router;