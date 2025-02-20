


"use client";

import { useState, useEffect } from "react";
import Table from "./table";
import PieChartComponent from "./pieChart";
import axios from "axios";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import TotalActiveUsers from "./ui/TotalActiveUsers";
import RunningProjects from "./ui/RunningProjects";
import PageSearchComponent from "./ui/pageSearchComp";

interface User {
    id: number;
    name: string;
    email: string;
    status: string;
}

const DashboardReadOnly = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/users/api");
            console.log("Fetched Users:", response.data);
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const activeUsers = users.filter(
        (user) => user.status.toLowerCase() === "active").length;
    const inactiveUsers = users.filter(
        (user) => user.status.toLowerCase() === "inactive").length;

    if (loading) return <p className="text-center p-4">Loading...</p>;
    if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

    return (
        <div className="w-4/5 p-5 ml-64 bg-gray-100 min-h-screen">
            <div className="fixed ml-10  top-0 left-1/3 transform -translate-x-1/2 w-1/3 mx-32 text-center mr-10 pt-2">
                <PageSearchComponent />
            </div>


            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 mb-6 pt-20">
                <div className="h-32 w-72  bg-white shadow-md rounded-lg flex flex-col justify-center items-center text-center hover:shadow-xl transition-shadow duration-300">
                    <FiUsers className="text-3xl text-blue-600 mb-1" />
                    <h6 className="font-bold text-lg text-gray-800">Total Users</h6>
                    <p className="text-2xl text-blue-600">{users.length}</p>
                </div>
                <div className="h-32 w-72  bg-white shadow-md rounded-lg flex flex-col justify-center items-center text-center text-white hover:shadow-xl transition-shadow duration-300">
                    <FiUserCheck className="text-3xl text-green-600 mb-1" />
                    <h6 className="font-bold text-lg text-gray-800">Active Users</h6>
                    <p className="text-2xl text-blue-600">{activeUsers}</p>
                </div>
                <div className="h-32 w-72 bg-white shadow-md rounded-lg flex flex-col justify-center items-center text-center text-white hover:shadow-xl transition-shadow duration-300">
                    <FiUserX className="text-3xl text-red-600 mb-1" />
                    <h6 className="font-bold text-lg text-gray-800">Inactive Users</h6>
                    <p className="text-2xl text-blue-600">{inactiveUsers}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ">
                <RunningProjects />
                <TotalActiveUsers />
            </div>


            {/* Table Component */}
            <div className="">
                <Table />
            </div>
            {/* Pie Chart Component */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    User Distribution
                </h2>
                <PieChartComponent activeUsers={activeUsers} inactiveUsers={inactiveUsers} />
            </div>
        </div>
    );
};

export default DashboardReadOnly;
