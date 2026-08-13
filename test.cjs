// test.cjs
const crypto = require("crypto");
const order_id   = "order_SsXSBcZqVVT0sK";

const body = order_id + "|" + process.env.PAYMENT_ID;

const expected = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(body)
  .digest("hex");  

console.log("Expected:", expected);