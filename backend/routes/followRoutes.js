import express from "express";
import {
  follow,
  unfollow,
  getUserFollowers,
  getUserFollowing,
  checkFollowStatus,
} from "../controller/followController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Authenticated routes for follow actions
router.post("/:userId/follow", authMiddleware, follow);
router.delete("/:userId/unfollow", authMiddleware, unfollow);
router.get("/:userId/followers", authMiddleware, getUserFollowers);
router.get("/:userId/following", authMiddleware, getUserFollowing);
router.get("/:userId/follow-status", authMiddleware, checkFollowStatus);

export default router;
