import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Only alphabets are allowed")
    .min(4, "First Name must be at least 4 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Only alphabets are allowed")
    .min(4, "Last Name must be at least 4 characters")
    .required("Last Name is required"),
  username: Yup.string()
    .matches(/^[A-Za-z0-9]+$/, "Alphabets and digits only")
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  rollNum: Yup.string()
    .matches(/^\d{4}[15]A[A-Za-z0-9]{4}$/, "Invalid roll number format")
    .length(10, "Roll number must be exactly 10 characters")
    .required("Roll number is required"),
  password: Yup.string()
    .min(6, "Password must be between 6 and 12 characters")
    .max(12, "Password must be between 6 and 12 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const rollNum = watch("rollNum");

  React.useEffect(() => {
    if (rollNum && /^\d{4}[15]A[A-Za-z0-9]{4}$/.test(rollNum)) {
      setValue("email", `${rollNum}@vnrvjiet.in`);
    }
  }, [rollNum, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/user/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Registration successful
      toast.success("Registration Successful");
      navigate("/home"); // Redirect to home or a success page after registration
    } catch (error) {
      // Error handling for registration
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Specific error message from server (like "Email already in use")
        toast.error(error.response.data.message);
      } else {
        // Generic error message if no specific message is provided
        toast.error("An unexpected error occurred during registration");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/** First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-600"
            >
              First Name
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName?.message}
            </p>
          </div>

          {/** Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-600"
            >
              Last Name
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName?.message}
            </p>
          </div>

          {/** Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              {...register("username")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.username?.message}
            </p>
          </div>

          {/** Roll Number */}
          <div>
            <label
              htmlFor="rollNum"
              className="block text-sm font-medium text-gray-600"
            >
              Roll Number
            </label>
            <input
              id="rollNum"
              {...register("rollNum")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.rollNum ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.rollNum?.message}
            </p>
          </div>

          {/** Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              readOnly
            />
          </div>

          {/** Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/** Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            disabled={!isValid}
          >
            Sign Up
          </button>

          {/** Link to Login */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
