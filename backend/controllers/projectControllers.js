import Project from "../models/Project.js";

export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {

};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const projects = await Project.find();

  return res.json(projects)
};