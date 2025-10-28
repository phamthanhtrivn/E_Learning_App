import User from "../models/User.js";

const createToken = (email, password) => {

};

export const verifyToken = async (req, res) => {

};

export const register = async (req, res) => {
  
};

export const login = async (req, res) => {
  
};

export const add = async (req, res) => {

};

export const update = async (req, res) => {

};

export const findById = async (req, res) => {
  const userId = req.params.id
  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  return res.json(user)
};

export const del = async (req, res) => {

};

export const findAll = async (req, res) => {
  const users = await User.find();

  return res.json(users)
};