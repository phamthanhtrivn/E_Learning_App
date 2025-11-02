import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

export const add = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Validate input
    if (!userId || !courseId) {
      return res.status(400).json({ message: "userId and courseId are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if enrollment already exists
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ message: "User already enrolled in this course" });
    }

    // Create new enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrollmentDate: new Date(),
      progress: 0,
      status: "ONGOING",
    });

    return res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {

};
export const findByUserId = async (req, res) => {
  const { userId } = req.params;
  const enrollments = await Enrollment.find({ userId })
    .populate("courseId", "title thumbnail totalDuration")
    .sort({ enrollmentDate: -1 });
  res.json(enrollments);
};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const enrollments = await Enrollment.find();

  return res.json(enrollments)
};