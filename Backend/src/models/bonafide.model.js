import { mongoose, Schema } from "mongoose";
import { formatDateTime } from "../utils/formatDateTime.js";

const bonafideSchema = new Schema({
  date: {
    type: String,
  },
  //   name: {
  //     type: String,
  //     required: [true, "Name is required"],
  //   },
  reason: {
    type: String,
    required: [true, "Reason is required"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
  },
  approvedBy: {
    type: String,
  },
  //   department: {
  //     type: String,
  //     required: [true, "Department is required"],
  //     enum: {
  //       values: [
  //         "CSE",
  //         "ECE",
  //         "ME",
  //         "CE",
  //         "EIE",
  //         "EEE",
  //         "AIML",
  //         "IOT",
  //         "DS",
  //         "CYS",
  //         "AIDS",
  //         "AE",
  //         "IT",
  //       ], // Example department names
  //       message: "Please select a valid department",
  //     },
  //   },
  //   rollNumber: {
  //     type: String,
  //     required: [true, "Roll Number is required"],
  //   },
  yearOfStudy: {
    type: Number,
    required: [true, "Year is required"],
    enum: {
      values: [1, 2, 3, 4],
      message: "Expected values are [1,2,3,4]",
    },
  },
  additionalinfo: {
    type: String,
  },
});

bonafideSchema.pre("save", function (next) {
  if (!this.date) {
    this.date = formatDateTime(Date.now());
  }
  next();
});

bonafideSchema.path("date").default(() => formatDateTime(Date.now()));

export const Bonafide = mongoose.model("bonafide", bonafideSchema);
