import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    banner: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
      asset_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
