import { razorpayInstance } from "../../config/razorPay.js"
import { asyncHandler } from "../../utils/asyncHandler.js";


  export  const  createOrder= asyncHandler(async(req,res)=>{
    const {price}=req.body
    console.log("req",req.body)




const options ={
    amount:price * 100,
    currency:"INR",
    receipt: `receipt_${Date.now()}`,
};


try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
        success: true,
        message: 'Razorpay order created successfully.',
        order,
    });
} catch (err) {
    res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order.',
        error: err.message,
    });
}
  })




  