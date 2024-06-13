import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { Letter } from "../Models/letter.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Outpass } from "../models/outpass.model.js";
import generatePDFAndSaveToFile from "../utils/generatePdf.js";
import sendMail from "../utils/sendEmail.js";
import generateQR from "../utils/generateQR.js";

const saveLetter = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const data = req.body;
  let result, createdLetter;
  let user = req.user;
  // console.log(req.user);
  switch (type) {
    case "outpass":
      const outpass = new Outpass(data);
      result = await outpass.save();
      // Example usage:
      const apiUrl = "https://pdfgen.app/api/generate?templateId=bc43343";
      const apiKey = "su1eciFshoWDAwXmeQtxJ";
      const requestData = {
        data: {
          date: outpass.date,
          name: user.firstName + " " + user.lastName,
          reason: outpass.reason,
          department: user.branch,
          rollNumber: user.rollNum,
          yearOfStudy: outpass.yearOfStudy,
        },
      };
      const filePath = "mypdf.pdf";

      await generatePDFAndSaveToFile(apiUrl, apiKey, requestData, filePath)
        .then()
        .catch();
      let uploadedRes;
      try {
        uploadedRes = await uploadOnCloudinary(filePath);
      } catch (error) {
        throw new ApiError(500, "Uploading to cloud was failed");
      }
      // console.log(uploadedRes);

      const letter = await Letter.create({
        userId: user._id,
        typeOfLetter: type,
        thatTypeLetterId: result._id,
        letterLinkEmpty: uploadedRes.url,
        status: "pending",
      });

      createdLetter = await Letter.findById(letter._id);

      if (!createdLetter) {
        res.status(500).json(new ApiError(500, "Unable to save into DB"));
      }

      // console.log(createdLetter);

      break;
    // Add more cases for other letter types here
    // case 'abc':
    //   result = await handleAbcType(data);
    //   break;
    default:
      return res.status(400).json({ error: `Invalid letter type: ${type}` });
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
    console.error("Error fetching history:", error);
    res
      .status(500)
      .json(new ApiError(500, "An error occurred while fetching history"));
  }
});

const sendEmail = asyncHandler(async (req, res) => {
  const user = req.user;
  const { facultyMail, letter } = req.body;

  try {
    // Find the letter by ID
    const letterBef = await Letter.findById(letter._id);
    if (!letterBef) {
      return res.status(400).json(new ApiError(400, "Invalid Letter"));
    }

    if (letterBef.status !== "notUsed") {
      return res.status(400).json(new ApiError(400, "Letter was already Used"));
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
        approveLink: `https://localhost:6000/approve/${letter._id}`,
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
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});

// sName,rollNum,branch,letter,reason,letterLink,approveLink

const approval = asyncHandler(async (req, res) => {
  const { letterId } = req.params;

  try {
    const letter = await Letter.findById(letterId);

    if (!letter) {
      return res.status(400).json(new ApiError(400, "Invalid Letter Id"));
    }

    const approved = req.body.approved; // Assuming you expect an 'approved' boolean in the request body

    if (!approved) {
      letter.status = "rejected";
      await letter.save({ validateBeforeSave: false });
      res
        .status(200)
        .json(new ApiResponse(200, letter, "Successfully Rejected"));
    }

    generateQR("http://localhost:6000/letter/:id");

    const uploadedQR = uploadOnCloudinary("qr.png");

    res
      .status(200)
      .json(new ApiResponse(200, letter, "Letter status updated successfully"));
  } catch (error) {
    console.error("Error updating letter status:", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});

export { saveLetter, getHistory, sendEmail, approval };
