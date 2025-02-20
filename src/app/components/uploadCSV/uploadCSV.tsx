"use client";
import { useState, useRef, SetStateAction } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState([]); // Store errors
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;


  const totalPages = Math.ceil(duplicates.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = duplicates.slice(startIndex, startIndex + recordsPerPage);

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

  const handleDownloadErrorCSV = () => {
    if (!errors.length) return;

    // Convert errors into CSV format
    const csvData = errors.map((error) => ({
      name: error.rowData?.name || "",
      email: error.rowData?.email || "",
      status: error.rowData?.status || "",
      "Error Message": error.message,
    }));

    const csv = Papa.unparse(csvData); // Convert JSON to CSV format
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "CSV_Errors.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handleCorrectFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a valid CSV file.");
        setFile(null);
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
      handleUpload(); // Auto-upload the corrected file
    }
  };


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
          <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-4xl max-h-[90vh] overflow-hidden">

            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-black">
                Duplicate Records ({duplicates.length} Total)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Table Container (Prevents Scrollbar) */}
            <div className="overflow-auto max-h-[70vh] pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {/* Table */}
              <table className="table-auto w-full text-black border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">S.No</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((duplicate, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{duplicate.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination  */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded text-black ${currentPage === 1 ? "bg-gray-300 text-black cursor-not-allowed" : "bg-blue-200 text-black hover:bg-blue-300"}`}
                >
                  Previous
                </button>
                <span className="text-black">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-black cursor-not-allowed" : "bg-blue-200 text-black hover:bg-blue-300"}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-4xl overflow-y-auto max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-black">CSV Upload Errors</h3>
              <button onClick={() => setShowErrorModal(false)} className="text-gray-500 hover:text-gray-700">
                ✖
              </button>
            </div>

            {/* Download & Upload Buttons */}
            <div className="flex justify-between mb-4">
              <button
                onClick={handleDownloadErrorCSV}
                className="bg-blue-200 text-black px-4 py-2 rounded-md hover:bg-blue-200"
              >
                Download CSV with Errors
              </button>

              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleCorrectFileChange} 
              />
              <button
                onClick={handleButtonClick}
              
                className="bg-blue-200 text-black px-4 py-2 rounded-md hover:bg-blue-200"
              >
                Re-upload Corrected CSV
              </button>
            </div>

            {/* Error Table */}
            <table className="table-auto w-full text-black border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Error Message</th>
                </tr>
              </thead>
              <tbody>
                {errors.slice(startIndex, startIndex + recordsPerPage).map((error, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{error.rowData?.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{error.rowData?.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{error.rowData?.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{error.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded text-black bg-gray-300 cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-black">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded bg-blue-200 text-black hover:bg-blue-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default CSVUpload;


