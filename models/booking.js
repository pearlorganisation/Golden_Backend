import mongoose from "mongoose";

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // packageId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Package",
    //   required: true,
    // },
    name: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    title: { type: String, required: true },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
    paymentStatus: {
      // Can also do boolean
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
      required: true,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create Model
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
