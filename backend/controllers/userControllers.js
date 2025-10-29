import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
const createToken = (email, password) => {

};

export const verifyToken = async (req, res) => {

};

export const register = async (req, res) => {

};

export const login = async (req, res) => {

};

export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Lấy thông tin user
    const user = await User.findById(id).populate({
      path: "savedCourses",
      model: Course,
      select: "title thumbnail price rating teacherId categoryId lessonCount",
      populate: [
        { path: "teacherId", select: "name avatar job" },
        { path: "categoryId", select: "name" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Lấy các khoá học mà user đang học và đã học
    const enrollments = await Enrollment.find({ userId: id })
      .populate({
        path: "courseId",
        model: Course,
        select: "title thumbnail price rating teacherId categoryId",
        populate: [
          { path: "teacherId", select: "name avatar job" },
          { path: "categoryId", select: "name" },
        ],
      });

    // 3️⃣ Phân loại khoá học theo trạng thái
    const ongoingCourses = enrollments
      .filter((en) => en.status === "ONGOING")
      .map((en) => ({
        ...en.courseId.toObject(),
        progress: en.progress,
      }));

    const completedCourses = enrollments
      .filter((en) => en.status === "COMPLETED")
      .map((en) => ({
        ...en.courseId.toObject(),
        progress: en.progress,
      }));

    // 4️⃣ Chuẩn hoá kết quả trả về
    const result = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        job: user.job,
        phone: user.phone,
      },
      savedCourses: user.savedCourses,
      ongoingCourses,
      completedCourses,
      counts: {
        saved: user.savedCourses.length,
        ongoing: ongoingCourses.length,
        completed: completedCourses.length,
      },
    };

    return res.json(result);
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ message: "Server error" });
  }

};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const users = await User.find();

  return res.json(users)
};