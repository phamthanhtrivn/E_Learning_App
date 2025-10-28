import Teacher from "../models/Teacher.js";

export const add = async (req, res) => {};

export const update = async (req, res) => {};

export const findById = async (req, res) => {};

export const del = async (req, res) => {};

export const findAll = async (req, res) => {
  const teachers = await Teacher.find().sort({ rating: -1, reviewCount: -1 }).limit(5);

  return res.json(teachers);
};
