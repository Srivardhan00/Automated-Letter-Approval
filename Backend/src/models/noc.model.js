import { mongoose, Schema } from "mongoose";
import { formatDateTime } from "../utils/formatDateTime.js";

const nocSchema = new Schema({
  date: {
    type: String,
  },
  // name: {
  //   type: String,
  //   required: [true, "Name is required"],
  // },
  reason: {
    type: String,
    required: [true, "Reason is required"],
  },
  toDate: {
    type: String,
    required: [true, "To Date is required"],
  },
  subject: {
    type: String,
    required: [true, "To Date is required"],
  },
  fromDate: {
    type: String,
    required: [true, "From Date is required"],
  },
  approvedBy: {
    type: String,
  },
  // department: {
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
  //     ],
  //     message: "Please select a valid department",
  //   },
  // },
  // rollNumber: {
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
      message: "Expected values are [1,2,3,4]",
    },
  },
  organisation: {
    type: String,
    required: [true, "Organization is required"],
  },
  additionalInfo: {
    type: String,
  },
});

nocSchema.path("date").default(() => formatDateTime(Date.now()));

export const Noc = mongoose.model("noc", nocSchema);
