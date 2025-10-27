import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: "" }
});

const Category = mongoose.models.category || mongoose.model("category", categorySchema);
export default Category;
