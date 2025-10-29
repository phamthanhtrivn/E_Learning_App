import Enrollment from "../models/Enrollment.js";

export const add = async (req, res) => {

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