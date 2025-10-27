import Category from "../models/Category.js";

export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {

};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const categories = await Category.find();

  return res.json(categories)
};