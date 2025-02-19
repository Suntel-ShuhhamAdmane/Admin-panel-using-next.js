


// import fs from "fs";
// import path from "path";
// import { NextResponse } from "next/server";

// // Function to parse the CSV text
// const parseCSV = (csvText: string): Record<string, string>[] => {
//   const rows = csvText
//     .replace(/\r\n/g, "\n")
//     .split("\n")
//     .map((row) => row.split(","));

//   const headers = rows[0].map((header) => header.replace(/"/g, "").trim());

//   const requiredHeaders = ["name", "email", "status"];
//   const isValidHeaders =
//     headers.length === requiredHeaders.length &&
//     headers.every((header, index) => header === requiredHeaders[index]);

//   if (!isValidHeaders) {
//     throw new Error("Invalid CSV headers. Required headers: name, email, status");
//   }

//   const data = rows.slice(1).map((row) => {
//     const cleanedRow = row.map((col) => col.replace(/"/g, "").trim());

//     if (cleanedRow.every((col) => col === "")) {
//       return null;
//     }

//     return headers.reduce((acc: Record<string, string>, header, colIndex) => {
//       acc[header] = cleanedRow[colIndex] || "";
//       return acc;
//     }, {});
//   });

//   return data.filter((row): row is Record<string, string> => row !== null);

// };

// // Function to filter out duplicates
// const filterDuplicates = (existingData: any[], newData: any[]) => {
//   const existingEmails = new Set(existingData.map((user) => user.email));

//   const duplicates = newData.filter((user) => existingEmails.has(user.email));

//   const filteredUsers = newData.filter((user) => {
//     if (existingEmails.has(user.email)) {
//       return false;
//     }
//     existingEmails.add(user.email);
//     return true;
//   });

//   return { filteredUsers, duplicates };
// };

// // POST method for uploading the CSV
// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file");

//     if (!file || !(file instanceof Blob)) {
//       return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
//     }

//     const csvText = await file.text();
//     let newUsers;
//     try {
//       newUsers = parseCSV(csvText);
//     } catch (error) {
//       return NextResponse.json(
//         { message: error.message },
//         { status: 400 }
//       );
//     }

//     const filePath = path.join(process.cwd(), "public", "users.json");

//     if (!fs.existsSync(path.dirname(filePath))) {
//       fs.mkdirSync(path.dirname(filePath), { recursive: true });
//     }

//     const existingData = fs.existsSync(filePath)
//       ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
//       : [];

//     let skipped = 0;
//     const validUsers = newUsers.filter(user => {
//       if (!user.name || !user.email || !user.status) { 
//         skipped++;
//         return false; 
//       }
//       return true;
//     });
//     const { filteredUsers, duplicates } = filterDuplicates(existingData, validUsers);

//     const totalRecords = newUsers.length;
//     const addedRecords = filteredUsers.length;

//     const maxExistingId = existingData.reduce(
//       (maxId, user) => (user.id > maxId ? user.id : maxId),
//       0
//     );

//     const updatedUsers = filteredUsers.map((user, index) => ({
//       id: maxExistingId + index + 1,
//       name: user.name,
//       email: user.email,
//       status: user.status,
//     }));

//     const updatedData = [...existingData, ...updatedUsers];

//     fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

//     return NextResponse.json(
//       {
//         message: "CSV data processed",
//         totalRecords: totalRecords,
//         addedRecords: addedRecords,
//         duplicates: duplicates,
//         skipped: skipped,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error processing file:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Function to parse the CSV text
const parseCSV = (csvText: string): Record<string, string>[] => {
  const rows = csvText
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((row) => row.split(","));

  const headers = rows[0].map((header) => header.replace(/"/g, "").trim());

  const requiredHeaders = ["name", "email", "status"];
  const isValidHeaders =
    headers.length === requiredHeaders.length &&
    headers.every((header, index) => header === requiredHeaders[index]);

  if (!isValidHeaders) {
    throw new Error("Invalid CSV headers. Required headers: name, email, status");
  }

  const data = rows.slice(1).map((row) => {
    const cleanedRow = row.map((col) => col.replace(/"/g, "").trim());

    if (cleanedRow.every((col) => col === "")) {
      return null;
    }

    return headers.reduce((acc: Record<string, string>, header, colIndex) => {
      acc[header] = cleanedRow[colIndex] || "";
      return acc;
    }, {});
  });

  return data.filter((row): row is Record<string, string> => row !== null);

};

// Function to filter out duplicates
const filterDuplicates = (existingData: any[], newData: any[]) => {
  const existingEmails = new Set(existingData.map((user) => user.email));

  const duplicates = newData.filter((user) => existingEmails.has(user.email));

  const filteredUsers = newData.filter((user) => {
    if (existingEmails.has(user.email)) {
      return false;
    }
    existingEmails.add(user.email);
    return true;
  });

  return { filteredUsers, duplicates };
};

// POST method for uploading the CSV
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const csvText = await file.text();
    let newUsers;
    try {
      newUsers = parseCSV(csvText);
    } catch (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "users.json");

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const existingData = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : [];

    let skipped = 0;
    const validUsers = newUsers.filter(user => {
      if (!user.name || !user.email || !user.status) { 
        skipped++;
        return false; 
      }
      return true;
    });
    const { filteredUsers, duplicates } = filterDuplicates(existingData, validUsers);

    const totalRecords = newUsers.length;
    const addedRecords = filteredUsers.length;

    const maxExistingId = existingData.reduce(
      (maxId, user) => (user.id > maxId ? user.id : maxId),
      0
    );

    const updatedUsers = filteredUsers.map((user, index) => ({
      id: maxExistingId + index + 1,
      name: user.name,
      email: user.email,
      status: user.status,
    }));

    const updatedData = [...existingData, ...updatedUsers];

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json(
      {
        message: "CSV data processed",
        totalRecords: totalRecords,
        addedRecords: addedRecords,
        duplicates: duplicates,
        skipped: skipped,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}