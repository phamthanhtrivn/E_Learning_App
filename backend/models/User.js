import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, unique: true },
    password: { type: String },
    avatar: { type: String, default: "" },
    job: { type: String, default: "" },
    phone: { type: String, default: "" },
    savedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  },
  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
