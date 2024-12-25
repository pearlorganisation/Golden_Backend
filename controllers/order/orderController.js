import { razorpayInstance } from "../../config/razorPay.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import crypto from "crypto";

export const createOrder = asyncHandler(async (req, res) => {
  const { price } = req.body;
  console.log("req", req.body);

  const options = {
    amount: price * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully.",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order.",
      error: err.message,
    });
  }
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  console.log("ids", req.body);

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Razorpay secret key not configured in environment variables.",
    });
  }

  // Generate the signature using HMAC with the Razorpay secret key
  const generateSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // Compare the generated signature with the one sent from the frontend
  if (generateSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature. Payment verification failed.",
    });
  }

  // Handle the rest of the payment verification logic
  try {
    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpayPaymentId,
    });
  } catch (err) {
    console.error("Database update error", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Payment verified, but failed to update database.",
    });
  }
});
