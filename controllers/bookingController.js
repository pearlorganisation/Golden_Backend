import crypto from "crypto";
import { nanoid } from "nanoid";
import Booking from "../models/booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { razorpayInstance } from "../config/razorPay.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const { totalPrice, name, title } = req.body;

  // Basic validation
  if (!totalPrice) {
    return res
      .status(400)
      .json({ message: "Amount and currency are required" });
  }
  const options = {
    amount: totalPrice * 100, // Convert amount to smallest unit (paise for INR)
    currency: "INR",
    receipt: `order_rcptid_${Math.floor(1000 + Math.random() * 9000)}`, // Generate unique receipt id
  };

  
  try {
    const order = await razorpayInstance.orders.create(options);
    const booking = await Booking.create({
      bookingId: `BID_${nanoid(6)}${Date.now()}`,
      user: "Mannu",
      name,
      title,
      totalPrice,
      bookingStatus: "Pending",
      paymentStatus: "Unpaid",
      razorpay_order_id: order.id,
    });

    // Return success response with order details
    res.status(200).json({
      success: true,
      order,
      bookingId: booking.bookingId,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error); // Log the complete error object for debugging
    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
});

// Verify payment signature
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    await Booking.findOneAndUpdate(
      { razorpay_order_id },
      { paymentStatus: "Paid", bookingStatus: "Completed" }
    );
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});
