import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  job: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  location: { type: String, default: "" },
  courseCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
});

const Teacher = mongoose.models.teacher || mongoose.model("teacher", teacherSchema);
export default Teacher;
