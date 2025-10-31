import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: String,
  duration: String,
  videoUrl: String,
  isLocked: { type: Boolean, default: true }
});

const sectionSchema = new mongoose.Schema({
  title: String,
  order: Number,
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  lessonCount: Number,
  totalDuration: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  thumbnail: String,
  benefits: [String],
  sections: [sectionSchema],
  resources: [String],
  isInspirational: { type: Boolean, default: false }
}, { timestamps: true });

const Course = mongoose.models.course || mongoose.model("course", courseSchema);
export default Course;
