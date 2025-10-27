import Teacher from "../models/Teacher.js";

export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {

};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const teachers = await Teacher.find();

  return res.json(teachers)
};