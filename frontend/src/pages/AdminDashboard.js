import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/user/get-all-users",
                    { withCredentials: true }
                );
                setUsers(response.data.data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Failed to fetch users");
                }
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <>
            <Header />
            <div className="p-8 min-h-screen bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard - Users</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left">Username</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Role</th>
                                    <th className="py-3 px-6 text-left">Branch</th>
                                    <th className="py-3 px-6 text-left">Roll Num</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{user.username}</td>
                                        <td className="py-3 px-6 text-left">{user.email}</td>
                                        <td className="py-3 px-6 text-left font-bold capitalize">{user.role}</td>
                                        <td className="py-3 px-6 text-left">{user.branch}</td>
                                        <td className="py-3 px-6 text-left">{user.rollNum || "N/A"}</td>
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
