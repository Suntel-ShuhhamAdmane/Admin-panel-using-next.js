import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const parseCSV = (csvText: string) => {
  const rows = csvText.replace(/\r\n/g, "\n").split("\n").filter(row => row.trim() !== "");
  const headers = rows[0].split(",").map(header => header.replace(/"/g, "").trim());
  
  const requiredHeaders = ["name", "email", "status"];
if (!requiredHeaders.every((header) => headers.includes(header))) {
  throw new Error("Invalid CSV headers. Required headers: name, email, status");
}


  const data: { [x: string]: string; }[] = [];
  const errors: { rowNumber: number; message: string; rowData?: { [x: string]: string; }; }[] = [];

  rows.slice(1).forEach((row: string, index: number) => {
    const columns = row.split(",").map(col => col.replace(/"/g, "").trim());
    if (columns.length !== headers.length) {
      errors.push({ rowNumber: index + 2, message: "Invalid number of columns" });
      return;
    }

    const record = headers.reduce((acc: { [x: string]: string; }, header: string | number, colIndex: string | number) => {
      acc[header] = columns[colIndex] || "";
      return acc;
    }, {});

    if (!record.name || !record.email || !record.status) {
      errors.push({ rowNumber: index + 2, message: "Missing required fields", rowData: record });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(record.email)) {
      errors.push({ rowNumber: index + 2, message: "Invalid email format", rowData: record });
      return;
    }

    if (!["Active", "Inactive"].includes(record.status)) {
      errors.push({ rowNumber: index + 2, message: "Invalid status. Only 'Active' or 'Inactive' allowed", rowData: record });
      return;
    }

    data.push(record);
  });

  return { data, errors };
};

const filterDuplicates = (existingData: any[], newData: any[]) => {
  const existingEmails = new Set(existingData.map(user => user.email));
  const duplicates = newData.filter(user => existingEmails.has(user.email));
  const uniqueRecords = newData.filter(user => !existingEmails.has(user.email));
  return { uniqueRecords, duplicates };
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const csvText = await file.text();
    let parsedData;
    try {
      parsedData = parseCSV(csvText);
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const { data: newUsers, errors: validationErrors } = parsedData;
    const filePath = path.join(process.cwd(), "public", "users.json");

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : [];
    const { uniqueRecords, duplicates } = filterDuplicates(existingData, newUsers);

    const maxExistingId = existingData.reduce((maxId: number, user: { id: number; }) => (user.id > maxId ? user.id : maxId), 0);
    const updatedUsers = uniqueRecords.map((user: { name: any; email: any; status: any; }, index: any) => ({
      id: maxExistingId + index + 1,
      name: user.name,
      email: user.email,
      status: user.status,
    }));

    const updatedData = [...existingData, ...updatedUsers];
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({
      message: "CSV data processed",
      totalRecords: newUsers.length,
      addedRecords: uniqueRecords.length,
      duplicates: duplicates,
      skipped: validationErrors.length,
      errors: validationErrors,
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


