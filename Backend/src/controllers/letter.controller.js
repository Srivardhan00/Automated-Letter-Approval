import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { Letter } from "../Models/letter.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Outpass } from "../models/outpass.model.js";
import generatePDFAndSaveToFile from "../utils/generatePdf.js";

const saveLetter = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const data = req.body;
  let result;
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
          name: outpass.name,
          reason: outpass.reason,
          department: outpass.dept,
          rollNumber: outpass.rollNo,
          yearOfStudy: outpass.yearOfStudy,
        },
      };
      const filePath = "mypdf.pdf";

      await generatePDFAndSaveToFile(apiUrl, apiKey, requestData, filePath)
        .then()
        .catch();

      try {
        const uploadedRes = await uploadOnCloudinary(filePath);
      } catch (error) {
        throw new ApiError(500, "Uploading to cloud was failed");
      }
      
      break;
    // Add more cases for other letter types here
    // case 'abc':
    //   result = await handleAbcType(data);
    //   break;
    default:
      return res.status(400).json({ error: `Invalid letter type: ${type}` });
  }
  const letter = new Letter();
  res.status(200).json(new ApiResponse(200, [], "Successfully saved"));
});

export { saveLetter };
