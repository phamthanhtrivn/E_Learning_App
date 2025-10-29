import Course from "../models/Course.js";
import Review from "../models/Review.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {
  try {
    const { id } = req.params;
    // const user = await User.findById(id);
    // ✅ 1. Tìm khóa học theo ID, kèm thông tin giáo viên và danh mục
    const course = await Course.findById(id)
      .populate("teacherId", "name job profilePicture")
      .populate("categoryId", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // const courses = await Course.find();
    // const courseCategory = courses.filter(c => user.savedCourses.includes(c._id) === false).limit(5);
    const courseCategory = await Course.find({ categoryId: course.categoryId, _id: { $ne: course._id } }).limit(5);


    // ✅ 2. Lấy danh sách đánh giá (review)
    const reviews = await Review.find({ courseId: id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    // ✅ 3. Lấy danh sách câu hỏi và trả lời (nếu có)
    const questions = await Question.find({ courseId: id })
      .populate("userId", "name avatar")
      .populate("answers.userId", "name avatar")
      .sort({ createdAt: -1 });

    // ✅ 4. Tính điểm trung bình và số lượng review
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
        ).toFixed(1)
        : 0;

    // ✅ 5. Chuẩn hóa dữ liệu trả về
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
        teacherId: course.teacherId, // đã populate
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

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const courses = await Course.find();

  return res.json(courses)
};