import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  fileName: String,
  title: String,
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.models.project || mongoose.model("project", projectSchema);
export default Project;
