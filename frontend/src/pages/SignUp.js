import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    .matches(/^[A-Za-z0-9]+$/, "alphabets and digits only")
    .min(4, "username must be at least 4 characters")
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
    console.log(data);
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

      console.log("Register successful:", response.data);
      toast.success("Register Successful", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      navigate("/home");
    } catch (error) {
      console.error("Register failed:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        toast.error(error.response.data, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            {...register("firstName")}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            {...register("lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            {...register("username")}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>
        <div className="form-group">
          <label htmlFor="rollNum">Roll Number</label>
          <input
            id="rollNum"
            {...register("rollNum")}
            className={`form-control ${errors.rollNum ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.rollNum?.message}</div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            {...register("email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            readOnly
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Sign Up
        </button>
        <div className="form-group">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </form>
    </div>
  );
}
