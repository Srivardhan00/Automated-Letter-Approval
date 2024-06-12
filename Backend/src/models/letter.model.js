import { mongoose, Schema } from "mongoose";

const letterSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
  typeOfLetter: {
    type: String,
  },
  thatTypeLetterId: {
    type: Schema.Types.ObjectId,
    refPath: "typeOfLetter",
  },
  facultyEmail: {
    type: String,
  },
  letterLinkEmpty: {
    type: String,
  },
  letterLinkApproved: {
    type: String,
  },
  status: {
    default: "notUsed",
    type: String,
    enum: ["notUsed", "pending", "approved", "rejected"],
  },
});

export const Letter = mongoose.model("letter", letterSchema);
