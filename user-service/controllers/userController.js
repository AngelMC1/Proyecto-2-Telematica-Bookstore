import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email
  });
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    message: "Login successful",
    user: { id: user._id, name: user.name, email: user.email }
  });
};
