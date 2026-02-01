import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { Letter } from "../Models/letter.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import generatePDFAndSaveToFile from "../utils/generatePdf.js";
import sendMail from "../utils/sendEmail.js";
import generateQR from "../utils/generateQR.js";
import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { formatDateTime } from "../utils/formatDateTime.js";
import axios from "axios";
import fs from "fs";

import { generateLocalPDF } from "../services/pdfService.js";

const saveLetter = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const data = req.body;
  let createdDocument, uploadedRes;
  const user = req.user;
  const outputFileName = `letter-${Date.now()}.pdf`;

  let LetterModel;
  let templateName;
  let templateData = {
    date: formatDateTime(Date.now()),
    name: `${user.firstName} ${user.lastName}`,
    rollNumber: user.rollNum,
    department: user.branch,
    yearOfStudy: data.yearOfStudy,
    reason: data.reason, // for outpass
    subject: data.subject, // for attendance
    additionalInfo: data.additionalInfo, // for attendance
  };

  switch (type) {
    case "outpass":
      LetterModel = mongoose.model("Outpass");
      templateName = "outpass";
      break;
    case "attendance":
      LetterModel = mongoose.model("AttLetter"); // reusing AttLetter schema
      templateName = "attendance";
      if (!data.subject) throw new ApiError(400, "Subject is required for Attendance");
      break;
    default:
      throw new ApiError(400, `Invalid letter type: ${type}`);
  }

  // Save to DB
  try {
    const letterInstance = new LetterModel({
      ...data,
      userId: user._id,
      yearOfStudy: data.yearOfStudy || 1, // Default or required?
    });
    createdDocument = await letterInstance.save();
  } catch (error) {
    throw new ApiError(500, "Error saving letter to the database: " + error.message);
  }

  // Generate PDF
  try {
    const filePath = await generateLocalPDF(templateName, templateData, outputFileName);
    uploadedRes = await uploadOnCloudinary(filePath);
  } catch (error) {
    throw new ApiError(500, "PDF generation or upload failed");
  }

  // Update DB with Link
  try {
    createdDocument = await LetterModel.findByIdAndUpdate(
      createdDocument._id,
      {
        letterLinkEmpty: uploadedRes.url,
      },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(500, "Error updating letter document with PDF link");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdDocument, "Successfully saved"));
});

const approval = asyncHandler(async (req, res) => {
  const letterId = req.params.id;
  const letter = await Letter.findById(new mongoose.Types.ObjectId(letterId));

  if (!letter) {
    throw new ApiError(500, "Invalid letter");
  }
  if (letter.status !== "notUsed" && letter.status !== "pending") {
    throw new ApiError(400, "The letter was already utilized");
  }

  const approved = req.body.approve;
  const user = await User.findById(new mongoose.Types.ObjectId(letter.userId));

  if (!approved) {
    letter.status = "rejected";
    letter.isApproved = false;
    await letter.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, letter, "Successfully Rejected"));
  } else {
    // Generate QR
    const qrText = `${process.env.FRONTEND_PATH || 'http://localhost:3000'}/view/${letter._id}`;
    generateQR(qrText); // writes to 'qr.png' locally? verify generateQR implementation
    // Assuming generateQR writes to 'qr.png' in root or current dir.
    // Let's assume generateQR works as before.

    const qrResponse = await uploadOnCloudinary("qr.png");

    letter.isApproved = true;
    letter.status = "approved";
    letter.approvedAt = formatDateTime(new Date());
    letter.approvedBy = req.user.email; // Faculty email

    // Prepare data for approved PDF
    const templateData = {
      date: letter.date,
      name: `${user.firstName} ${user.lastName}`,
      rollNumber: user.rollNum,
      department: user.branch,
      yearOfStudy: letter.yearOfStudy,
      reason: letter.reason,
      subject: letter.subject, // if exists
      additionalInfo: letter.additionalInfo, // if exists
      approvedBy: letter.approvedBy,
      approvedAt: letter.approvedAt,
      qrCode: qrResponse.url
    };

    let templateName = "outpass";
    if (letter.type === "AttLetter") templateName = "attendance";
    // We should store type better or check instance. 
    // letter.type is stored by discriminator? yes, 'type' field in baseLetterSchema.

    if (letter.t === "AttLetter" || letter.type === "AttLetter") { // Check how discriminator stores type. usually 'type' field default.
      templateName = "attendance";
    }

    // Generate Approved PDF
    try {
      const outputFileName = `approved-${letter._id}.pdf`;
      const filePath = await generateLocalPDF(templateName, templateData, outputFileName);
      const pdfUploadResponse = await uploadOnCloudinary(filePath);

      letter.letterLinkApproved = pdfUploadResponse.url;
      await letter.save({ validateBeforeSave: false });

      res
        .status(200)
        .json(
          new ApiResponse(200, letter, "Letter approved successfully")
        );
    } catch (err) {
      throw new ApiError(500, "Error generating approved PDF: " + err.message);
    }
  }
});

const showLetter = asyncHandler(async (req, res) => {
  const letterId = req.params.id;

  const letter = await Letter.findOne({ _id: letterId });
  if (!letter) {
    throw new ApiError(400, "Invalid Link");
  }
  const student = await User.findOne({
    _id: new mongoose.Types.ObjectId(letter.userId),
  }).select("-password -refreshToken");

  const data = {
    rollNum: student.rollNum,
    email: student.email,
    name: student.firstName + " " + student.lastName,
    branch: student.branch,
    isApproved: letter.isApproved,
    approvedBy: letter.approvedBy,
    yearOfStudy: letter.yearOfStudy,
    reason: letter.reason,
    date: letter.date,
    status: letter.status,
    approvedAt: letter.updatedAt,
    letterLinkApproved: letter.letterLinkApproved,
  };
  res.send(new ApiResponse(200, data, "Outpass fetched successfully"));
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const user = req.user;

  // Assuming verifyRole ensures user is faculty
  const department = user.branch;

  // Find all pending letters and populate user details
  const letters = await Letter.find({ status: "pending" }).populate(
    "userId",
    "firstName lastName rollNum branch"
  );

  // Filter by department
  // If department logic is strictly branch-based:
  const departmentLetters = letters.filter((letter) => {
    return letter.userId && letter.userId.branch === department;
  });

  if (departmentLetters.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No Pending Requests"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, departmentLetters, "Pending Requests Fetched"));
});

export { saveLetter, getHistory, approval, showLetter, getPendingRequests };
