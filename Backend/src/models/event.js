import { mongoose, Schema } from "mongoose";
import { formatDateTime } from "../utils/formatDateTime.js";

const eventSchema = new Schema({
  dep: {
    type: String,
    required: [true, "Department/Club is required"],
  },
  date: {
    type: String,
  },
  event: {
    type: String,
    required: [true, "Event Name is required"],
  },
  venue: {
    type: String,
    required: [true, "Venue is required"],
  },
  detail: {
    type: String,
  },
  evedate: {
    type: String,
    required: [true, "Event Date is required"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
  },
  approvedBy: {
    type: String,
  },
  additionalinfo: {
    type: String,
  },
});

eventSchema.pre("save", function (next) {
  if (!this.date) {
    this.date = formatDateTime(Date.now());
  }
  next();
});

eventSchema.path("date").default(() => formatDateTime(Date.now()));

export const Event = mongoose.model("event", eventSchema);
