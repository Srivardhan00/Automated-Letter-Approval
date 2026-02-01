import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function FacultyDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/letter/pending",
                { withCredentials: true }
            );
            setRequests(response.data.data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to fetch requests");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, approve) => {
        try {
            await axios.post(
                `http://localhost:8000/letter/approve/${id}`,
                { approve },
                { withCredentials: true }
            );
            toast.success(approve ? "Approved Successfully" : "Rejected Successfully");
            fetchRequests(); // Refresh list
        } catch (error) {
            toast.error("Action Failed");
        }
    };

    return (
        <>
            <Header />
            <div className="p-8 min-h-screen bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8">Faculty Dashboard</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : requests.length === 0 ? (
                    <p className="text-center text-gray-600">No Pending Requests</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-purple-600 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-left">Student Name</th>
                                    <th className="py-3 px-6 text-left">Roll No</th>
                                    <th className="py-3 px-6 text-left">Type</th>
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {requests.map((req) => (
                                    <tr key={req._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{req.date}</td>
                                        <td className="py-3 px-6 text-left">
                                            {req.userId?.firstName} {req.userId?.lastName}
                                        </td>
                                        <td className="py-3 px-6 text-left">{req.userId?.rollNum}</td>
                                        <td className="py-3 px-6 text-left capitalize">
                                            {req.type || "Letter"}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex item-center justify-center space-x-2">
                                                <Link
                                                    to={`/view/${req._id}`}
                                                    target="_blank"
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleAction(req._id, true)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, false)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
