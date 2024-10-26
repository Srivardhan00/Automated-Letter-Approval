import axios from "axios";
import fs from "fs";
import { ApiError } from "./ApiError.js";

export default async function generatePDFAndSaveToFile(
  apiUrl,
  apiKey,
  requestData,
  filePath
) {
  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        api_key: apiKey,
      },
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        resolve();
      });
      writer.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    throw new ApiError(500, error);
  }
}
