import db from "../config/database.js";

export async function followUser(followerId, followedId) {
  try {
    const [result] = await db.execute(
      "INSERT INTO user_followers (follower_id, followed_id) VALUES (?, ?)",
      [followerId, followedId]
    );
    return result.insertId;
  } catch (error) {
    // Handle duplicate follow attempt
    if (error.code === "ER_DUP_ENTRY") {
      return null;
    }
    throw error;
  }
}

export async function unfollowUser(followerId, followedId) {
  const [result] = await db.execute(
    "DELETE FROM user_followers WHERE follower_id = ? AND followed_id = ?",
    [followerId, followedId]
  );
  return result.affectedRows > 0;
}

export async function getFollowers(userId) {
  const [rows] = await db.execute(
    "SELECT u.id, u.username FROM users u " +
      "JOIN user_followers uf ON u.id = uf.follower_id " +
      "WHERE uf.followed_id = ?",
    [userId]
  );
  return rows;
}

export async function getFollowing(userId) {
  const [rows] = await db.execute(
    "SELECT u.id, u.username FROM users u " +
      "JOIN user_followers uf ON u.id = uf.followed_id " +
      "WHERE uf.follower_id = ?",
    [userId]
  );
  return rows;
}

export async function isFollowing(followerId, followedId) {
  const [rows] = await db.execute(
    "SELECT * FROM user_followers WHERE follower_id = ? AND followed_id = ?",
    [followerId, followedId]
  );
  return rows.length > 0;
}
