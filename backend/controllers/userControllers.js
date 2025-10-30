import User from "../models/User.js";
import jwt from "jsonwebtoken"
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import bcrypt from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

export const register = async (req, res) => {};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = createToken(user);

  res.json({ token });
};


export const add = async (req, res) => {};

export const update = async (req, res) => {};

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

export const del = async (req, res) => {};

export const findAll = async (req, res) => {
  const users = await User.find();

  return res.json(users);
};
