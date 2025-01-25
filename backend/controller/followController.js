import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
} from "../model/follow.js";

export async function follow(req, res) {
  try {
    const followerId = req.user.id; // From auth middleware
    const { userId: followedId } = req.params;

    // Prevent self-follow
    if (followerId === parseInt(followedId)) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const result = await followUser(followerId, followedId);

    if (result) {
      res.status(201).json({ message: "Successfully followed user" });
    } else {
      res.status(400).json({ message: "Already following this user" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
}

export async function unfollow(req, res) {
  try {
    const followerId = req.user.id; // From auth middleware
    const { userId: followedId } = req.params;

    const result = await unfollowUser(followerId, followedId);

    if (result) {
      res.status(200).json({ message: "Successfully unfollowed user" });
    } else {
      res.status(400).json({ message: "Not following this user" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
}

export async function getUserFollowers(req, res) {
  try {
    const { userId } = req.params;
    const followers = await getFollowers(userId);
    res.json(followers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving followers", error: error.message });
  }
}

export async function getUserFollowing(req, res) {
  try {
    const { userId } = req.params;
    const following = await getFollowing(userId);
    res.json(following);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving following", error: error.message });
  }
}

export async function checkFollowStatus(req, res) {
  try {
    const followerId = req.user.id;
    const { userId: followedId } = req.params;

    const followStatus = await isFollowing(followerId, followedId);
    res.json({ isFollowing: followStatus });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking follow status", error: error.message });
  }
}
