import { mongoose, Schema } from "mongoose";
import { formatDateTime } from "../utils/formatDateTime.js";

const outPassSchema = new Schema({
  date: {
    type: String,
  },
  // name: {
  //   type: String,
  //   required: [true, "Name is required"],
  // },
  // rollNo: {
  //   type: String,
  //   required: [true, "Roll Number is required"],
  //   minLength: [10, "Roll number should be 10 letters"],
  //   maxLength: [10, "Roll number should be 10 letters"],
  // },
  yearOfStudy: {
    type: Number,
    required: [true, "Year is required"],
    enum: {
      values: [1, 2, 3, 4],
      message: "Expected values are [1, 2, 3, 4].",
    },
  },
  // dept: {
  //   type: String,
  //   required: [true, "Department is required"],
  //   enum: {
  //     values: [
  //       "CSE",
  //       "ECE",
  //       "ME",
  //       "CE",
  //       "EIE",
  //       "EEE",
  //       "AIML",
  //       "IOT",
  //       "DS",
  //       "CYS",
  //       "AIDS",
  //       "AE",
  //       "IT",
  //     ], // Example department names
  //     message: "Please select a valid department",
  //   },
  // },
  reason: {
    type: String,
    required: [true, "Reason is required"],
  },
});

outPassSchema.pre("save", function (next) {
  if (!this.date) {
    this.date = formatDateTime(Date.now());
  }
  next();
});

outPassSchema.path('date').default(() => formatDateTime(Date.now()));

export const Outpass = mongoose.model("outpass", outPassSchema);