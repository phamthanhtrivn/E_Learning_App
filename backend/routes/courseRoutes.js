import express from "express";
import {
  add,
  del,
  findAll,
  findByCategory,
  findById,
  findByIdCourse,
  getInspirationalCourses,
  getPopularCourses,
  getRecommendedCourses,
  searchCourses,
  update,
} from "../controllers/courseControllers.js";

const courseRoute = express.Router();

courseRoute.post("/", add);
courseRoute.get("/", findAll);
courseRoute.put("/:id", update);
courseRoute.delete("/:id", del);
courseRoute.get("/popular/:userId", getPopularCourses);
courseRoute.get("/recommended/:userId", getRecommendedCourses);
courseRoute.get("/inspirational/:userId", getInspirationalCourses);
courseRoute.get("/search", searchCourses);
courseRoute.get("/category/:categoryId", findByCategory)
courseRoute.get("/:id", findById);
courseRoute.get("/learning/:id", findByIdCourse);

export default courseRoute;
