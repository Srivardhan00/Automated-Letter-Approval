import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function Status() {
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
          error.response.data.message || "Unable to approve letter";
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

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/letter/approve/${id}`,
        {
          approve: true,
        },
        { withCredentials: true }
      );
      toast.success("Approved Successfully");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Unable to Approve letter";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/letter/approve/${id}`,
        {
          approve: false,
        },
        { withCredentials: true }
      );
      toast.success("Rejected Successfully");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Unable to Reject letter";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-y-4">
        {letterData ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Name: <span className="font-normal">{letterData.name}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Roll Number:{" "}
              <span className="font-normal">{letterData.rollNum}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Email: <span className="font-normal">{letterData.email}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Branch: <span className="font-normal">{letterData.branch}</span>
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
                {letterData.status}
              </span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Approval:{" "}
              <span className="font-normal">
                {letterData.isApproved ? "Yes" : "No"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Loading data...</p>
        )}
        <button
          onClick={handleApprove}
          className={
            letterData?.status === "approved" ||
            letterData?.status === "rejected"
              ? `bg-gray-500 font-semibold py-2 px-4 rounded-lg w-full max-w-xs`
              : `bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full max-w-xs transition-all`
          }
          disabled={
            letterData?.status === "approved" ||
            letterData?.status === "rejected"
          }
        >
          APPROVE
        </button>
        <button
          onClick={handleReject}
          className={
            letterData?.status === "approved" ||
            letterData?.status === "rejected"
              ? `bg-gray-500 font-semibold py-2 px-4 rounded-lg w-full max-w-xs`
              : "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full max-w-xs transition-all"
          }
          disabled={
            letterData?.status === "approved" ||
            letterData?.status === "rejected"
          }
        >
          REJECT
        </button>
      </div>
    </div>
  );
}
