"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function homepage() {
  const [users, setUsers] = useState([]);
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Use axios directly
        const usersResponse = await axios.get(
          "http://localhost:5500/api/users",
          {
            withCredentials: true, // Important for sending cookies
          }
        );
        const userList = usersResponse.data;

        // Fetch follow status
        const statusPromises = userList.map(async (user) => {
          try {
            const statusResponse = await axios.get(
              `http://localhost:5500/api/users/${user.id}/follow-status`,
              {
                withCredentials: true,
              }
            );
            return {
              userId: user.id,
              isFollowing: statusResponse.data.isFollowing,
            };
          } catch {
            return { userId: user.id, isFollowing: false };
          }
        });

        const statuses = await Promise.all(statusPromises);

        const statusMap = statuses.reduce((acc, status) => {
          acc[status.userId] = status.isFollowing;
          return acc;
        }, {});

        setUsers(userList);
        setFollowStatus(statusMap);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleFollowToggle = async (userId) => {
    try {
      if (followStatus[userId]) {
        await axios.delete(
          `http://localhost:5500/api/users/${userId}/unfollow`,
          {
            withCredentials: true,
          }
        );
        setFollowStatus((prev) => ({
          ...prev,
          [userId]: false,
        }));
      } else {
        await axios.post(
          `http://localhost:5500/api/users/${userId}/follow`,
          {},
          {
            withCredentials: true,
          }
        );
        setFollowStatus((prev) => ({
          ...prev,
          [userId]: true,
        }));
      }
    } catch (error) {
      console.error("Follow/Unfollow failed", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p>{user.email}</p>
              <button
                onClick={() => handleFollowToggle(user.id)}
                className={`mt-2 px-4 py-2 rounded ${
                  followStatus[user.id]
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {followStatus[user.id] ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
