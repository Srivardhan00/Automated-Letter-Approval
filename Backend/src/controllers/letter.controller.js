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

const saveLetter = asyncHandler(async (req, res) => {
  const { type } = req.params; // Letter type (e.g., 'outpass', 'event')
  const data = req.body;
  let createdDocument, apiKey, apiUrl, requestData, uploadedRes;
  const filePath = "mypdf.pdf";
  const user = req.user;
  // Use discriminators to create specific instances based on the type
  let LetterModel;
  switch (type) {
    case "outpass":
      LetterModel = mongoose.model("Outpass");
      apiUrl = "https://pdfgen.app/api/generate?templateId=bc43343";
      apiKey = "su1eciFshoWDAwXmeQtxJ";
      requestData = {
        data: {
          date: formatDateTime(Date.now()),
          name: `${user.firstName} ${user.lastName}`,
          reason: data.reason,
          department: user.branch,
          rollNumber: user.rollNum,
          yearOfStudy: data.yearOfStudy,
        },
      };
      break;
    case "event":
      LetterModel = mongoose.model("Event");
      apiUrl = "https://pdfgen.app/api/generate?templateId=3538066";
      apiKey = "zgqRTbD2vxfr6zPdLad8";
      requestData = {
        data: {
          dep: data.dep,
          date: data.date,
          event: data.event,
          venue: data.venue,
          detail: data.detail,
          evedate: data.evedate,
          subject: data.subject,
          approvedBy: data.approvedBy,
          additionalinfo: data.additionalinfo,
        },
      };
      break;
    default:
      throw new ApiError(400, `Invalid letter type: ${type}`);
  }

  // Save the specific letter document to the database
  try {
    const letterInstance = new LetterModel(data);
    createdDocument = await letterInstance.save();
  } catch (error) {
    throw new ApiError(500, "Error saving letter to the database");
  }
  // Generate PDF and upload it
  try {
    await generatePDFAndSaveToFile(apiUrl, apiKey, requestData, filePath);
    uploadedRes = await uploadOnCloudinary(filePath);
  } catch (error) {
    throw new ApiError(500, "PDF generation or upload failed");
  }

  // Create a reference in the main Letter model
  const letterRecord = await Letter.create({
    userId: user._id,
    typeOfLetter: type,
    thatTypeLetterId: createdDocument._id,
    letterLinkEmpty: uploadedRes.url,
    status: "pending",
    reason: data.reason,
    yearOfStudy: data.yearOfStudy,
  });

  res
    .status(200)
    .json(new ApiResponse(200, letterRecord, "Successfully saved"));
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

  // Fetch the letter and its detailed type instance
  const letter = await Letter.findById(new mongoose.Types.ObjectId(letterId));

  if (!letter) {
    throw new ApiError(500, "Invalid letter");
  }
  if (letter.status !== "notUsed" && letter.status !== "pending") {
    throw new ApiError(400, "The letter was already used");
  }
  if (!letter.facultyEmail) {
    throw new ApiError(400, "Invalid Faculty Mail");
  }
  const approved = req.body.approve; // Boolean indicating approval
  const user = await User.findById(new mongoose.Types.ObjectId(letter.userId));

  if (!approved) {
    letter.status = "rejected";
    await letter.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, letter, "Successfully Rejected"));
  } else {
    // Update letter as approved and generate a PDF with QR
    generateQR(`http://localhost:3000/view/${letter._id}`);
    const qrResponse = await uploadOnCloudinary("qr.png");

    letter.isApproved = true;
    letter.status = "approved";
    letter.approvedAt = formatDateTime(new Date());

    const requestData = {
      data: {
        date: letter.date,
        name: `${user.firstName} ${user.lastName}`,
        qrCode: qrResponse.url,
        reason: letter.reason,
        approvedAt: letter.approvedAt,
        approvedBy: letter.facultyEmail,
        department: user.branch,
        rollNumber: user.rollNum,
        yearOfStudy: letter.yearOfStudy,
      },
    };

    // PDF generation and saving
    try {
      const pdfResponse = await axios.post(
        "https://pdfgen.app/api/generate?templateId=63a5d10",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            api_key: process.env.OUTPASS_API_KEY,
          },
          responseType: "stream",
        }
      );

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream("mypdf.pdf");
        pdfResponse.data.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      const pdfUploadResponse = await uploadOnCloudinary("mypdf.pdf");
      letter.letterLinkApproved = pdfUploadResponse.url;
      await letter.save({ validateBeforeSave: false });

      res
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
