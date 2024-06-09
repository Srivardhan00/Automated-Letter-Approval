import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already taken"],
    },
    rollNum: {
      type: String,
      required: [true, "Roll number is required"],
      minLength: [10, "Roll number should be 10 letters"],
      maxLength: [10, "Roll number should be 10 letters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    branch: {
      type: String,
      // required: [true, "Branch is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("user", userSchema);
