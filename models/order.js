import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId:{ type: String, required: true, unique: true},
        name:{type: String, required: true},
        totalPrice:{ type: Number, required: true},
        title:{ type: String, required: true},

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
        razorpay_order_id:{
            type:String,
        },
         razorpay_payment_id: {
             type: String,
         },
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Orders",orderSchema)
export default Order;