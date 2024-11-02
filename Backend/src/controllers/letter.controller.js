import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { Letter } from "../Models/letter.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Outpass } from "../models/outpass.model.js";
import { Event } from "../models/event.js";
import generatePDFAndSaveToFile from "../utils/generatePdf.js";
import sendMail from "../utils/sendEmail.js";
import generateQR from "../utils/generateQR.js";
import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { formatDateTime } from "../utils/formatDateTime.js";
import axios from "axios";
import fs from "fs";

const saveLetter = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const data = req.body;
  let result, createdLetter;
  let user = req.user;
  let apiKey, apiUrl, requestData, uploadedRes;
  const filePath = "mypdf.pdf";
  switch (type) {
    case "outpass":
      const outpass = new Outpass(data);
      result = await outpass.save();
      // Example usage:
      apiUrl = "https://pdfgen.app/api/generate?templateId=bc43343";
      apiKey = "su1eciFshoWDAwXmeQtxJ";
      requestData = {
        data: {
          date: outpass.date,
          name: user.firstName + " " + user.lastName,
          reason: outpass.reason,
          department: user.branch,
          rollNumber: user.rollNum,
          yearOfStudy: outpass.yearOfStudy,
        },
      };
      await generatePDFAndSaveToFile(apiUrl, apiKey, requestData, filePath);
      try {
        uploadedRes = await uploadOnCloudinary(filePath);
      } catch (error) {
        throw new ApiError(500, "Uploading to cloud was failed");
      }
      break;
    case "event":
      const event = new Event(data);
      result = await event.save();
      // Example usage:
      apiUrl = "https://pdfgen.app/api/generate?templateId=3538066";
      apiKey = "zgqRTbD2vxfr6zPdLad8";
      requestData = {
        data: {
          dep: event.dep,
          date: event.date,
          event: event.event,
          venue: event.venue,
          detail: event.detail,
          evedate: event.evedate,
          subject: event.subject,
          approvedBy: event.approvedBy,
          additionalinfo: event.additionalinfo,
        },
      };
      await generatePDFAndSaveToFile(apiUrl, apiKey, requestData, filePath);
      try {
        uploadedRes = await uploadOnCloudinary(filePath);
      } catch (error) {
        throw new ApiError(500, "Uploading to cloud was failed");
      }
      break;
    default:
      throw new ApiError(400, `Invalid letter type: ${type}`);
  }
  const letter = await Letter.create({
    userId: user._id,
    typeOfLetter: type,
    thatTypeLetterId: result._id,
    letterLinkEmpty: uploadedRes.url,
    status: "pending",
  });
  createdLetter = await Letter.findById(letter._id);
  if (!createdLetter) {
    throw new ApiError(500, "Error while saving into DB");
  }
  res
    .status(200)
    .json(new ApiResponse(200, createdLetter, "Successfully saved"));
});

const getHistory = asyncHandler(async (req, res) => {
  const user = req.user;

  try {
    const letters = await Letter.find({ userId: user._id });

    if (letters.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No History Found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, letters, "History Fetched Successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching history");
  }
});

const sendEmail = asyncHandler(async (req, res) => {
  const user = req.user;
  const { facultyMail, letter } = req.body;

  try {
    // Find the letter by ID
    const letterBef = await Letter.findById(letter._id);
    if (!letterBef) {
      throw new ApiError(400, "Invalid Letter");
    }

    if (letterBef.status !== "notUsed") {
      throw new ApiError(400, "Letter was already Used");
    }

    // Update and save the letter (assuming letterBef is a mongoose document)
    // Make sure to handle validation errors by passing { validateBeforeSave: false }
    letterBef.set({
      status: "pending", // Update status or any other fields as needed
    });
    await letterBef.save({ validateBeforeSave: false });

    // Call sendEmail function (assuming it's asynchronous and returns a promise)
    const mailResponse = await sendMail(
      {
        sName: user.firstName + " " + user.lastName,
        rollNum: user.rollNum,
        branch: user.branch,
        letter: letter.typeOfLetter,
        letterLink: letter.letterLinkEmpty,
        approveLink: `https://localhost:3000/status/${letter._id}`,
        email: user.email,
      },
      facultyMail
    );

    // Check if facultyMail is in the accepted list of recipients
    if (!mailResponse.accepted.includes(facultyMail)) {
      return res.status(500).json(new ApiError(500, "Mail did not reach"));
    }

    // Respond with success if everything went well
    res
      .status(200)
      .json(new ApiResponse(200, letter, "Mail Sent Successfully"));
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const approval = asyncHandler(async (req, res) => {
  const letterId = req.params.id;

  const letter = await Letter.findOne({ _id: letterId });

  if (!letter) {
    throw new ApiError(500, "Invalid letter");
  }

  const approved = req.body.approve; // Assuming you expect an 'approve' boolean in the request body

  if (!approved) {
    letter.status = "rejected";
    await letter.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, letter, "Successfully Rejected"));
  } else {
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(letter.userId),
    });

    // Generate QR code
    generateQR(`http://localhost:3000/view/${letter._id}`);

    // Upload QR code to Cloudinary
    const qrResponse = await uploadOnCloudinary("qr.png");

    // Mark the letter as approved
    letter.isApproved = true;
    letter.status = "approved";
    letter.approvedAt = String(formatDateTime(new Date()));
    
    // Prepare data for PDF generation
    const data = {
      data: {
        date: letter.date,
        name: user.firstName + " " + user.lastName,
        qrCode: qrResponse.url, // QR Code URL from Cloudinary
        reason: letter.reason,
        approvedAt: letter.approvedAt,
        approvedBy: letter.facultyEmail,
        department: user.branch,
        rollNumber: user.rollNum,
        yearOfStudy: letter.yearOfStudy,
      },
    };

    // Step 1: Generate the PDF and save it locally
    try {
      const pdfResponse = await axios({
        method: "post",
        url: "https://pdfgen.app/api/generate?templateId=63a5d10",
        headers: {
          "Content-Type": "application/json",
          api_key: process.env.OUTPASS_API_KEY,
        },
        responseType: "stream",
        data: data,
      });

      // Step 2: Save the PDF to the filesystem
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream("mypdf.pdf");
        pdfResponse.data.pipe(writeStream);

        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      // Step 3: Upload the saved PDF to Cloudinary
      const pdfUploadResponse = await uploadOnCloudinary("mypdf.pdf");

      // Update the letter record with the generated PDF link
      letter.letterLinkApproved = pdfUploadResponse.url;
      // Save the updated letter
      await letter.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json(
          new ApiResponse(200, letter, "Letter status updated successfully")
        );
    } catch (err) {
      throw new ApiError(500, err);
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
    facultyEmail: letter.facultyEmail,
    yearOfStudy: letter.yearOfStudy,
    reason: letter.reason,
    date: letter.date,
    status: letter.status,
    approvedAt: letter.approvedAt,
    letterLinkApproved: letter.letterLinkApproved,
  };
  res.send(new ApiResponse(200, data, "Outpass fetched successfully"));
});

export { saveLetter, getHistory, sendEmail, approval, showLetter };
