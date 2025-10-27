import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  enrollmentDate: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  status: { type: String, default: "ONGOING", enum: ["ONGOING", "COMPLETED"] }
});

const Enrollment = mongoose.models.enrollment || mongoose.model("enrollment", enrollmentSchema);
export default Enrollment;
