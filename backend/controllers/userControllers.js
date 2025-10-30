import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

export const register = async (req, res) => {};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = createToken(user);

  res.json({ token });
};

export const add = async (req, res) => {};

export const update = async (req, res) => {};

export const findById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
};

export const del = async (req, res) => {};

export const findAll = async (req, res) => {
  const users = await User.find();

  return res.json(users);
};
