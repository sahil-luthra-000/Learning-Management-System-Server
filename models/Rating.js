// models/Rating.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
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
});

export const Rating = mongoose.model("Rating", ratingSchema);
