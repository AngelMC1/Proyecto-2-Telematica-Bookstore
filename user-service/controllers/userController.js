import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { publishUserEvent } from "../rabbitmq.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    await publishUserEvent("USER_REGISTERED", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Credenciales inválidas" });

    res.json({
      message: "Inicio de sesión exitoso",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
