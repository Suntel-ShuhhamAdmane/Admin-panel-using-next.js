
"use client";
import { useState, useRef, SetStateAction } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of duplicates to show per page
  const [showModal, setShowModal] = useState(false); 
  const [totalDuplicateCount, setTotalDuplicateCount] = useState(0);
  const [errors, setErrors] = useState([]); // Store errors
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a valid CSV file.");
        setFile(null);
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("users/import/api", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const duplicateCount = result.duplicates?.length || 0;
        const totalRecords = result.totalRecords || 0;
        const addedRecords = result.addedRecords || 0;
        const skippedCount = result.skipped || 0;
  
        let message = "";
  
        if (skippedCount > 0) {
          message += `${skippedCount} records were skipped due to validation errors. `;
        }
  
        if (duplicateCount > 0 && addedRecords > 0) {
          message += `${duplicateCount} records are duplicates. ${addedRecords} records added successfully.`;
          toast.warn(message);
        } else if (duplicateCount === totalRecords && totalRecords > 0) {
          message += `All ${totalRecords} records are duplicates! Please check your file.`;
          toast.error(message);
        } else if (duplicateCount === 0 && totalRecords > 0 && skippedCount === 0) {
          message += "CSV uploaded successfully.";
          toast.success(message);
        } else if (totalRecords === 0) {
          message += "No records processed. Please check your file.";
          toast.error(message);
        } else if (duplicateCount > 0 && addedRecords === 0) {
          message += `${duplicateCount} records are duplicates. No new records added.`;
          toast.error(message);
        } else if (addedRecords > 0 && skippedCount === 0) {
          message += `${addedRecords} records added successfully.`;
          toast.success(message);
        } else if (addedRecords > 0 && skippedCount > 0) {
          message += `${addedRecords} records added successfully. ${skippedCount} records were skipped due to validation errors.`;
          toast.success(message);
        }
  
        if (result.errors && result.errors.length > 0) {
          setErrors(result.errors);
          setShowErrorModal(true);
        }
  
        if (result.duplicates && result.duplicates.length > 0) {
          setDuplicates(result.duplicates);
          setShowModal(true);
        }
  
        setFile(null);
      } else {
        toast.error(result.message || "Failed to upload CSV");
        setFile(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading CSV");
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDuplicates = duplicates.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  return (
    <div className="w-1/2 mx-auto mt-8">
      <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      <div className="flex space-x-3">
        <button
          onClick={file ? handleUpload : handleButtonClick}
          className="bg-blue-200 text-black p-2 rounded w-[130px] mb-2 text-sm disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : file ? "Upload CSV" : "Select CSV File"}
        </button>
      </div>

      {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-black">Duplicate Records</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="mb-2 text-black"></p> {/* Display total count */}
                        <ul className="list-disc pl-5 text-black overflow-y-auto max-h-48">
                            {duplicates.map((duplicateGroup) => (
                                <li key={duplicateGroup.email}>
                                    Email: {duplicateGroup.email} {duplicateGroup.count} 
                                    {duplicateGroup.example && (
                                        <ul className="list-disc pl-5">
                                            {duplicateGroup.example.map((example, index) => (
                                                <li key={index}>
                                                    {example.name} - {example.email} - {example.status}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

{showErrorModal && ( // Error Modal
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-4xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-black">CSV Upload Errors</h3>
                            <button onClick={() => setShowErrorModal(false)} className="text-gray-500 hover:text-gray-700">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <table className="table-auto w-full text-black">
                            <thead>
                                <tr>
                                    <th>Row Number</th>
                                    <th>Error Message</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errors.map((error, index) => (
                                    <tr key={index}>
                                        <td>{error.rowNumber}</td>
                                        <td>{error.message}</td>
                                        <td>{error.rowData?.name}</td>
                                        <td>{error.rowData?.email}</td>
                                        <td>{error.rowData?.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
  );
};

export default CSVUpload;