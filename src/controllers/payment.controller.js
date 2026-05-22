const crypto = require("crypto");
const razorpay = require("../../razorpay");
 
// ─── CREATE ORDER ──────────────────────────────────────────
const CreateOrderController = async (req, res) => {
  try {
    const { amount } = req.body;
 
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
 
    const order = await razorpay.orders.create({
      amount: amount * 100,      
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
 
    return res.status(200).json(order);
 
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ message: "Payment order failed" });
  }
};
 
// ─── VERIFY PAYMENT ────────────────────────────────────────
const VerifyPaymentController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ✅ Strict undefined check — empty string bhi allow karo
    if (
      razorpay_order_id === undefined ||
      razorpay_payment_id === undefined ||
      razorpay_signature === undefined
    ) {
      return res.status(400).json({ message: "All payment fields are required" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .toString("hex");

    console.log("Expected:  ", expectedSignature);
    console.log("Received:  ", razorpay_signature);
    console.log("Match:     ", expectedSignature === razorpay_signature);
    console.log("Expected:  ", expectedSignature);
console.log("Received:  ", razorpay_signature);
console.log("Secret used:", process.env.RAZORPAY_KEY_SECRET);
console.log("Body used:  ", body);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment_id: razorpay_payment_id,
    });

  } catch (err) {
    console.error("Verify Payment Error:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};
 
module.exports = { CreateOrderController, VerifyPaymentController };
 