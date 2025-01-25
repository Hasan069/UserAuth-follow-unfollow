"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      // Send data to the backend
      const response = await axios.post(
        "http://localhost:5500/api/auth/login",
        data,
        {
          withCredentials: true, // Ensures cookies are sent and received
        }
      );

      // Handle success (e.g., navigate to another page or show a success message)
      console.log("login successful:", response.data);
      toast.success("login Successfully!");
      router.push("/homepage"); // Redirect to login page
    } catch (error) {
      // Handle error (e.g., show error messages)
      console.error("Signup failed:", error.response?.data || error.message);
      toast.error("Signup failed! User Already exist");
    }
  };

  return (
    <>
      Login
      <div className="h-12 w-44">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            name="email"
            {...register("email", {
              required: "Required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            })}
            className="text-white h-8 rounded-md bg-slate-950 p-2 border border-white"
            placeholder="username"
          />
          {errors?.firstName?.type === "required" && (
            <p className="text-red-500">This field is required</p>
          )}
          <label>password</label>
          <input
            {...register("password", {
              required: true,
              maxLength: 32,
            })}
            className="text-white h-8 rounded-md bg-slate-950 p-2 border border-white"
            placeholder="username"
          />
          {errors?.firstName?.type === "required" && (
            <p className="text-red-500">This field is required</p>
          )}
          <button type="submit">submit</button>
        </form>
      </div>
    </>
  );
};

export default signup;
