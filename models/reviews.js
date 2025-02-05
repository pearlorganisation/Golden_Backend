import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewsSchema);

export default Review;
