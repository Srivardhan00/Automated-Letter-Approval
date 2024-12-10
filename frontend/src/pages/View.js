import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-GB", options);
}
export default function View() {
  const { id } = useParams();
  const [letterData, setLetterData] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/letter/view/${id}`
      );
      setLetterData(response.data.data); // Extract and store the data part of the response
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Unable to fetch letter details";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-y-4">
        {letterData ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Roll Number:{" "}
              <span className="font-normal">{letterData.rollNum}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Email: <span className="font-normal">{letterData.email}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Name: <span className="font-normal">{letterData.name}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Branch: <span className="font-normal">{letterData.branch}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Year of Study:{" "}
              <span className="font-normal">
                {letterData.yearOfStudy || ""}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Faculty Email:{" "}
              <span className="font-normal">{letterData.approvedBy || ""}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Reason:{" "}
              <span className="font-normal">{letterData.reason || ""}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Date: <span className="font-normal">{letterData.date || ""}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Status:{" "}
              <span
                className={`font-normal ${
                  letterData.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {letterData.status || ""}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Approval:{" "}
              <span className="font-normal">
                {letterData.isApproved ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Approved At:{" "}
              <span className="font-normal">
                {formatDateTime(letterData.approvedAt) || ""}
              </span>
            </p>
            <p className="text-lg font-semibold text-blue-900 mb-4">
              Letter Link Approved:
              <a href={letterData.letterLinkApproved}>OPEN</a>
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Loading data...</p>
        )}
      </div>
    </div>
  );
}
