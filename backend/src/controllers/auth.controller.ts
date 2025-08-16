import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "El usuario ya existe" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Crear token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: "Error registrando usuario", error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err });
  }
};