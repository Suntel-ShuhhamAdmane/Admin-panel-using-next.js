// "use client";
// import { useState, useRef } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CSVUpload = () => {
//   const [file, setFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleButtonClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0];

//     if (selectedFile) {
//       if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
//         toast.error("Please upload a valid CSV file.");
//         setFile(null);
//         e.target.value = "";
//         return;
//       }
//       setFile(selectedFile);
//     } else {
//       setFile(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       toast.error("Please choose a file first");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch("users/import/api", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         const duplicateCount = result.duplicates?.length || 0;
//         const totalRecords = result.totalRecords || 0;
//         const addedRecords = result.addedRecords || 0;
//         const skippedCount = result.skipped || 0; // Retrieve the skipped count
    
//         let message = ""; // Build a message string
    
//         if (skippedCount > 0) {
//             message += `${skippedCount} records were skipped due to missing values. `;
//         }
    
//         if (duplicateCount > 0 && addedRecords > 0) {
//             message += `${duplicateCount} records are duplicates. ${addedRecords} records added successfully.`;
//             toast.warn(`All ${totalRecords} total records!`);
//             toast.warn(message); // Show combined message
            
//         } else if (duplicateCount === totalRecords && totalRecords > 0) {
//             message += `All ${totalRecords} records are duplicates! Please check your file.`;
//             toast.error(message);
//         } else if (duplicateCount === 0 && totalRecords > 0 && skippedCount === 0) {
//             message += "CSV uploaded successfully.";
//             toast.success(message);
//         } else if (totalRecords === 0) {
//             message += "No records processed. Please check your file.";
//             toast.error(message);
//         } else if (duplicateCount > 0 && addedRecords === 0) {
//             message += `${duplicateCount} records are duplicates. No new records added.`;
//             toast.error(message);
//         } else if (addedRecords > 0 && skippedCount === 0) {
//             message += `${addedRecords} records added successfully.`;
//             toast.success(message);
//         } else if (addedRecords > 0 && skippedCount > 0) {
//             message += `${addedRecords} records added successfully. ${skippedCount} records were skipped due to missing values.`;
//             toast.success(message);
//         }
    
    
    
//         setFile(null);
//     } else if (response.status === 409) {
//         toast.error(result.message || "Conflict: Duplicate data found.");
//         setFile(null);
//     } else {
//         toast.error(result.message || "Failed to upload CSV");
//         setFile(null);
//     }
    
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       toast.error("Error uploading CSV");
//       setFile(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-1/2 mx-auto mt-8">
//       <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

//       <div className="flex space-x-3">
//         <button
//           onClick={file ? handleUpload : handleButtonClick}
//           className="bg-blue-200 text-black p-2 rounded w-[130px] mb-2 text-sm disabled:opacity-50"
//           disabled={isLoading}
//         >
//           {isLoading ? "Uploading..." : file ? "Upload CSV" : "Select CSV File"}
//         </button>
//       </div>

//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
//     </div>
//   );
// };

// export default CSVUpload;




"use client";
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: { target: { files: any[]; value: string; }; }) => {
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
        const skippedCount = result.skipped || 0; // Retrieve the skipped count
    
        let message = ""; // Build a message string
    
        if (skippedCount > 0) {
            message += `${skippedCount} records were skipped due to missing values. `;
        }
    
        if (duplicateCount > 0 && addedRecords > 0) {
            message += `${duplicateCount} records are duplicates. ${addedRecords} records added successfully.`;
            toast.warn(`All ${totalRecords} total records!`);
            toast.warn(message); // Show combined message
            
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
            message += `${addedRecords} records added successfully. ${skippedCount} records were skipped due to missing values.`;
            toast.success(message);
        } 
        setFile(null);
    } else if (response.status === 409) {
        toast.error(result.message || "Conflict: Duplicate data found.");
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

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default CSVUpload;