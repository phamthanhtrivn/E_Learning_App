import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  content: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  content: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  answers: [answerSchema]
});

const Question = mongoose.models.question || mongoose.model("question", questionSchema);
export default Question;
