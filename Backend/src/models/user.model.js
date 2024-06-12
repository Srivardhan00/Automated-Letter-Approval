import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
      required: [true, "Branch is required"],
      enum: {
        values: [
          "CSE",
          "ECE",
          "ME",
          "CE",
          "EIE",
          "EEE",
          "AIML",
          "IOT",
          "DS",
          "CYS",
          "AIDS",
          "AE",
          "IT",
        ], // Example department names
        message: "Please select a valid department",
      },
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
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); //triggers only if password changes
  }
  next();
});

userSchema.methods.passwordCheck = async function (password) {
  return await bcrypt.compare(password, this.password); //returns true or false after comparing, so takes time
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //payload
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    //jwt secret for access token
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    //payload is low because its generates so many times
    {
      _id: this._id,
    },
    //jwt secret for refresh token
    process.env.REFRESH_TOKEN_SECRET,
    {
      //here expiresIn is less time than access token always
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("user", userSchema);
