import { nanoid } from "nanoid";
import { razorpayInstance } from "../../config/razorPay.js";
import Order from "../../models/order.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import crypto from "crypto";
import addWatermark from "../../utils/pdfWatermarker.js";
import  createAndSendPdfMail   from "../../utils/createWaterMarkHandle.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { price, title,buyerName,buyerNumber,buyerEmail } = req.body;
  console.log("req", req.body);

  if(!price || !title || !buyerName || !buyerNumber || !buyerEmail){
   return res.status(400).json({message:"Require all the details"})
  }
  const options = {
    amount: price * 100,
    currency: "INR",
    receipt: `order_rcptid_${Math.floor(1000 + Math.random() * 9000)}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    const pdfOrder = await Order.create({
      orderId : `BID_${nanoid(6)}${Date.now()}`,
      name: buyerName,
      totalPrice:price,
      title:title,
      email:buyerEmail,
      mobileNumber:buyerNumber,
      orderStatus: "Pending",
      paymentStatus:"Unpaid",
      razorpayOrderId: order.id
    })
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
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, buyerEmail, pdfUrl , buyerName} = req.body;
  console.log("ids", req.body);

  // if (!process.env.RAZORPAY_KEY_SECRET) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "Razorpay secret key not configured in environment variables.",
  //   });
  // }

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
    const confirm = await Order.findOneAndUpdate(
      { razorpayOrderId },
      {orderStatus:"Completed", paymentStatus:"Paid"},
      {
        new: true
      }
    );
    if(confirm.paymentStatus === "Paid"){
      const result = await createAndSendPdfMail(pdfUrl, buyerEmail, buyerName)
      res.status(200).json({
      success: true,
      message: "Payment verified successfully and a mail is sent with your pdf attached.",
      paymentId: razorpayPaymentId,
    });
    }
    console.log('-----------------order confirm is', confirm)
     
  } catch (err) {
    console.error("Database update error", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Payment verified, but failed to update database.",
    });
  }
});
