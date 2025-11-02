import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Question from "../models/Question.js";

export const add = async (req, res) => {};

export const update = async (req, res) => {};

export const del = async (req, res) => {};

export const findByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const courses = await Course.find({ categoryId });

    res.json({ total: courses.length, results: courses});
  } catch (error) {
    console.error("❌ Error fetching courses by category:", error);
    res.status(500).json({
      message: "Server error while fetching courses by category",
      error: error.message,
    });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Missing search keyword" });

    const regex = new RegExp(q, "i");

    const courses = await Course.find({
      $or: [
        { title: regex },
        { description: regex },
        { "sections.lessons.title": regex }
      ]
    })
      .populate("teacherId", "name")
      .populate("categoryId", "name")

    res.json({ total: courses.length, results: courses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const findById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("teacherId", "name job profilePicture")
      .populate("categoryId", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // const courses = await Course.find();
    // const courseCategory = courses.filter(c => user.savedCourses.includes(c._id) === false).limit(5);
    const courseCategory = await Course.find({ categoryId: course.categoryId, _id: { $ne: course._id } }).limit(5);


    const reviews = await Review.find({ courseId: id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    const questions = await Question.find({ courseId: id })
      .populate("userId", "name avatar")
      .populate("answers.userId", "name avatar")
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
        ).toFixed(1)
        : 0;

    const result = {
      course: {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        description: course.description,
        price: course.price,
        rating: Number(averageRating),
        reviewCount,
        lessonCount: course.sections?.reduce(
          (sum, sec) => sum + (sec.lessons?.length || 0),
          0
        ),
        benefits: course.benefits,
        sections: course.sections,
        categoryId: course.categoryId,
        teacherId: course.teacherId,
      },
      reviews,
      questions,
      courseCategory
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching course details:", error);
    res.status(500).json({
      message: "Server error while fetching course details",
      error: error.message,
    });
  }

};

export const findAll = async (req, res) => {
  const courses = await Course.find();

  return res.json(courses);
};

export const getPopularCourses = async (req, res) => {
  try {
    const userId = req.params.userId;

    const enrolledCourses = await Enrollment.find({ userId }).distinct("courseId");

    const courses = await Course.aggregate([
      {
        $match: {
          _id: { $nin: enrolledCourses },
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

    const categories = await Course.find({
      _id: { $in: enrolled },
    }).distinct("categoryId");

    let query = {};

    if (categories.length > 0) {
      query = {
        categoryId: { $in: categories },
        _id: { $nin: enrolled },
      };
    } else {
      query = {
        _id: { $nin: enrolled },
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
      { $unwind: "$teacher" }
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

    const enrolledCourses = await Enrollment.find({ userId }).distinct("courseId");

    const courses = await Course.aggregate([
      {
        $match: {
          isInspirational: true,
          _id: { $nin: enrolledCourses }, 
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