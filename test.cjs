// test.cjs
const crypto = require("crypto");

const order_id   = "order_SsXSBcZqVVT0sK";
const payment_id = "pay_SsXSOExHOwwd2z";
const secret     = "x5pIykYBR6AW4maQS6huExT3";

const body = order_id + "|" + payment_id;

const expected = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");  // ✅ toString nahi — digest

console.log("Expected:", expected);