import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    pages: { type: String, required: true },
    faculty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", notesSchema);

export default Notes;
