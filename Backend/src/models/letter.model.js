import { mongoose, Schema } from "mongoose";
import { formatDateTime } from "../utils/formatDateTime.js";

const baseLetterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: String,
      default: formatDateTime(Date.now()),
    },
    reason: {
      type: String,
      required: true,
    },
    approvedBy: {
      type: String,
    },
    yearOfStudy: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "notUsed",
      enum: ["notUsed", "pending", "approved", "rejected"],
    },
    letterLinkApproved: {
      type: String,
    },
    letterLinkEmpty: {
      type: String,
    },
  },
  { discriminatorKey: "type", timestamps: true }
);

export const Letter = mongoose.model("Letter", baseLetterSchema);
const nocSchema = Letter.discriminator(
  "NOC",
  new Schema({
    toDate: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
  })
);

const outPassSchema = Letter.discriminator(
  "Outpass",
  new Schema({
    fromDate: {
      type: String,
      default: formatDateTime(Date.now()),
    },
  })
);

const bonafideSchema = Letter.discriminator(
  "Bonafide",
  new Schema({
    subject: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
  })
);

const attLetterSchema = Letter.discriminator(
  "AttLetter",
  new Schema({
    addInfo: {
      type: String,
    },
  })
);
