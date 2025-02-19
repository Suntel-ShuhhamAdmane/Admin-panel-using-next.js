// import { useState, useEffect } from "react";
// import { BarChart } from "@mui/x-charts/BarChart";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
// import SearchComponent from "./SearchComponent";

// interface User {
//     id: number;
//     name: string;
//     email: string;
//     status: string; 
// }

// const Table = () => {
//     const [rows, setRows] = useState<User[]>([]);
//     const [filteredRows, setFilteredRows] = useState<User[]>([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchUsers = async () => {
//         try {
//             const response = await axios.get<User[]>("/users/api");  
//             console.log("Fetched Users:", response.data);
//             setRows(response.data);
//             setFilteredRows(response.data);  // Initialize filtered rows
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching users:", error);
//             setError("Failed to fetch users.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     useEffect(() => {
//         // Filter rows based on search query
//         const filtered = rows.filter(user =>
//             user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             user.email.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//         setFilteredRows(filtered);
//     }, [searchQuery, rows]);

//     const columns = [
//         { field: "id", headerName: "ID", width: 100 },
//         { field: "name", headerName: "Name", width: 150 },
//         { field: "email", headerName: "Email", width: 200 },
//         { field: "status", headerName: "Status", width: 100 },
//     ];

//     if (loading) return <p className="text-center bg-blue-200 p-4">Loading...</p>;
//     if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

//     return (
//         <div className="flex flex-col w-full h-auto">
//             <SearchComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery}  />
//             <div className="flex w-full">
//                 <div className="w-3/5 p-4">
//                     <DataGrid
//                         rows={filteredRows}
//                         columns={columns}
//                         pageSize={5}
//                         rowsPerPageOptions={[5]}
//                     />
//                 </div>
//                 <div className="w-2/5 p-4">
//                     <BarChart
//                         xAxis={[{ scaleType: "band", data: ["Active", "Inactive"] }]}
//                         series={[
//                             {
//                                 data: [filteredRows.filter(user => user.status.toLowerCase() === "active").length],
//                                 label: 'Active',
//                             },
//                             {
//                                 data: [filteredRows.filter(user => user.status.toLowerCase() === "inactive").length],
//                                 label: 'Inactive',
//                             },
//                         ]}
//                         width={400}
//                         height={300}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Table;


import { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import SearchComponent from "./SearchComponent";

interface User {
    id: number;
    name: string;
    email: string;
    status: string;
}

const Table = () => {
    const [rows, setRows] = useState<User[]>([]);
    const [filteredRows, setFilteredRows] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>("/users/api");
            setRows(response.data);
            setFilteredRows(response.data); // Initialize filtered rows
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

    useEffect(() => {
        const filtered = rows.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRows(filtered);
    }, [searchQuery, rows]);

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "status", headerName: "Status", width: 100 },
    ];

    if (loading) return <p className="text-center bg-blue-100 p-4 rounded-lg shadow-md">Loading...</p>;
    if (error) return <p className="text-center p-4 text-red-500 rounded-lg shadow-md">{error}</p>;

    return (
        <div className="flex flex-col w-full h-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">User Management</h1>
            
            {/* Centered Search Box */}
            

            <div className="flex w-full gap-6">
                <div className="w-3/5">
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2 ">User List</h2>
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            className="border-none"
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: '#f5f5f5',
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="w-full ">
                    <div className="bg-white rounded-lg shadow-lg p-4 h-[430px]">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2 ">User Status Chart</h2>
                        <BarChart
                            xAxis={[{ scaleType: "band", data: ["Active", "Inactive"] }]}
                            series={[
                                {
                                    data: [filteredRows.filter(user => user.status.toLowerCase() === "active").length],
                                    label: 'Active',
                                    color: '#4CAF50'
                                },
                                {
                                    data: [filteredRows.filter(user => user.status.toLowerCase() === "inactive").length],
                                    label: 'Inactive',
                                    color: '#F44336'
                                },
                            ]}
                            width={400}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
