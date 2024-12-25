import mongoose from "mongoose";
import { type } from "os";

const orderSchema = new mongoose.Schema(
    {
        orderId:{ type: String, required: true, unique: true}, // orderid uniquely generated in the backend
        name:{type: String, required: true}, // buyer name
        totalPrice:{ type: Number, required: true}, // total price
        title:{ type: String, required: true}, // the name of the pdf file
        email:{ type:String }, // buyer email
        mobileNumber:{type : String}, // buyer Number

        orderStatus:{
            type:String,
            enum: ["Pending", "Completed", "Failed"],
            required: true
        },
        paymentStatus:{
            type: String,
            enum:["Paid","Unpaid"],
            default:"Unpaid",
            required: true
        },
        razorpayOrderId: {
            type:String,
        },
         razorpayPaymentId: {
             type: String,
         },
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Orders",orderSchema)
export default Order;