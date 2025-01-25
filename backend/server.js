import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import pool from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", followRoutes);
app.use("/api/", userRoutes);
// Server start
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  const checkConnection = async () => {
    try {
      const connection = await pool.getConnection();
      console.log("Connected to Database");
      connection.release();
    } catch (error) {
      console.log("Connection error", error);
    }
  };
  checkConnection();
  console.log(`Server running on port ${PORT}`);
  console.log(`DB password is ${process.env.DATABASE_PASSWORD}`);
});
