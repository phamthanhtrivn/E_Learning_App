import Teacher from "../models/Teacher.js";
import Course from "../models/Course.js";
import Review from "../models/Review.js";

export const add = async (req, res) => {};

export const update = async (req, res) => {};

export const findById = async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const Courses = await Course.find({ teacherId: id }).select("title thumbnail price rating lessonCount categoryId").sort({ rating: -1 });
  const courseIds = Courses.map((c) => c._id);
  const reviews = await Review.find({ courseId: { $in: courseIds } })
    .populate("userId", "name avatar")
    .populate("courseId", "title")
    .sort({ dateTime: -1 })
    .lean();

  const result = {
    teacher,

    courses: Courses,
    reviews
  };

  return res.json(result);


};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const teachers = await Teacher.find().sort({ rating: -1, reviewCount: -1 }).limit(5);

  return res.json(teachers);
};
