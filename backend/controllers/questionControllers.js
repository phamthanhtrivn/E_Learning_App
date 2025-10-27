import Question from "../models/Question.js";

export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {

};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const questions = await Question.find();

  return res.json(questions)
};