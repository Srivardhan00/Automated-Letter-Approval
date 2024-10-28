import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function Status() {
  const { id } = useParams();

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
        const errorMessage = error.response.data.message || "Unable to Approve letter";
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
        const errorMessage = error.response.data.message || "Unable to Reject letter";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-y-4">
        <button
          onClick={handleApprove}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full max-w-xs transition-all"
        >
          APPROVE
        </button>
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full max-w-xs transition-all"
        >
          REJECT
        </button>
      </div>
    </div>
  );
}
