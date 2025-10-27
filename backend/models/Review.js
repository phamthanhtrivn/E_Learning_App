import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, default: "" },
  dateTime: { type: Date, default: Date.now }
});

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);
export default Review;
