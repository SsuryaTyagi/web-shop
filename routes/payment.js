const express = require("express");
const razorpay = require("../razorpay");

const paymentRouter = express.Router();

paymentRouter.post("/create-order",async (req,res)=>{
    const {amount} = req.body;

    const order = await razorpay.orders.create({
        amount:amount*100, //Rupees = paise
        currency:"INR",
        receipt:"receipt_1"
    });

    res.json(order);
});


module.exports = paymentRouter;