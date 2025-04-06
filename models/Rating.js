import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses", // Assuming this is your Course model name
      required: true,
    },
    // lectureId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Lecture",
    //   required: true,
    // },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Rating =
  mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
