import { createUser, findUserByEmail } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const userId = await createUser(username, email, password);

    // Generate token
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful" });
    console.log(token);
    // console.log(cookie);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export function logout(req, res) {
  // Clear the token cookie
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
}
