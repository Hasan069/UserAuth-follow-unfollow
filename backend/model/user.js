import pool from "../config/database.js";
import bcrypt from "bcrypt";

export async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}
