import express from "express";
import pool from "../config/database.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Route to get all users except the current user
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, email FROM users WHERE id != ?",
      [req.user.id]
    );
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

export default router;
