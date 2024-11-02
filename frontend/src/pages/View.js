import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function View() {
  const { id } = useParams();
  const [letterData, setLetterData] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await axios.post(
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
              <span className="font-normal">
                {letterData.facultyEmail || ""}
              </span>
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
              <span className="font-normal">{letterData.approvedAt || ""}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Letter Link Approved:{" "}
              <span className="font-normal">
                {letterData.letterLinkApproved || ""}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Loading data...</p>
        )}
      </div>
    </div>
  );
}