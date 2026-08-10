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
  const Secret = "x5pIykYBR6AW4maQS6huExT3";
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", Secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        debug: {
          expected: expectedSignature,
          received: razorpay_signature,
        },
      });
    }

    return res.status(200).json({
      success: true,
      payment_id: razorpay_payment_id,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { CreateOrderController, VerifyPaymentController };
