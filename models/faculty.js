import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    institute: { type: String, required: true },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
