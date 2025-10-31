import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("savedCourses")
      .populate("cart")
      .select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Lỗi xác thực" });
  }
};

export const register = async (req, res) => {};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = createToken(user);
  const userData = await User.findById(user._id).select("-password");

  res.json({ token, user: userData });
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
    const enrollments = await Enrollment.find({ userId: id }).populate({
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

export const toggleSavedCourse = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Chuyển courseId sang ObjectId
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Kiểm tra xem course đã có trong danh sách chưa
    const alreadySaved = user.savedCourses.some((id) =>
      id.equals(courseObjectId)
    );

    if (alreadySaved) {
      // Nếu đã có thì xóa ra khỏi danh sách
      user.savedCourses = user.savedCourses.filter(
        (id) => !id.equals(courseObjectId)
      );
    } else {
      // Nếu chưa có thì thêm vào (với dạng ObjectId thực sự)
      user.savedCourses.push(courseObjectId);
    }

    await user.save();

    res.status(200).json({
      message: alreadySaved
        ? "Course removed from saved list"
        : "Course added to saved list",
      savedCourses: user.savedCourses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
