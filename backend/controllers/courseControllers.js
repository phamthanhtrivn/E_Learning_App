import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

export const add = async (req, res) => {};

export const update = async (req, res) => {};

export const findById = async (req, res) => {};

export const del = async (req, res) => {};

export const findAll = async (req, res) => {
  const courses = await Course.find();

  return res.json(courses);
};

export const getPopularCourses = async (req, res) => {
  try {
    const userId = req.params.userId;

    const enrolledCourses = await Enrollment.find({ userId }).distinct("courseId");
    const user = await User.findById(userId).lean();
    const savedCourseIds = user?.savedCourses || [];

    const excludedCourses = [...enrolledCourses, ...savedCourseIds];

    const courses = await Course.aggregate([
      {
        $match: {
          _id: { $nin: excludedCourses },
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      { $sort: { rating: -1, reviewCount: -1 } },
      { $limit: 5 },
    ]);

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch popular courses" });
  }
};

export const getRecommendedCourses = async (req, res) => {
  try {
    const userId = req.params.userId;

    const enrolled = await Enrollment.find({ userId }).distinct("courseId");
    const user = await User.findById(userId).lean();
    const savedCourseIds = user?.savedCourses || [];

    const excludedCourses = [...enrolled, ...savedCourseIds];

    const categories = await Course.find({
      _id: { $in: enrolled },
    }).distinct("categoryId");

    let query = {};

    if (categories.length > 0) {
      query = {
        categoryId: { $in: categories },
        _id: { $nin: excludedCourses },
      };
    } else {
      query = {
        _id: { $nin: excludedCourses },
      };
    }

    const recommendedCourses = await Course.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      { $limit: 5 },
    ]);

    res.json(recommendedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recommended courses" });
  }
};

export const getInspirationalCourses = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Lấy danh sách course user đã mua
    const enrolledCourses = await Enrollment.find({ userId }).distinct("courseId");

    // Lấy danh sách course user đã lưu
    const user = await User.findById(userId).lean();
    const savedCourseIds = user?.savedCourses || [];

    // Gộp các course cần loại trừ
    const excludedCourses = [...enrolledCourses, ...savedCourseIds];

    // Lấy course truyền cảm hứng mà user chưa mua/lưu
    const courses = await Course.aggregate([
      {
        $match: {
          isInspirational: true,
          _id: { $nin: excludedCourses }, // loại bỏ course đã mua hoặc đã lưu
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      { $sort: { rating: -1, reviewCount: -1 } },
      { $limit: 5 },
    ]);

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No inspirational courses found" });
    }

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch inspirational courses" });
  }
};