import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const filePath = path.join(process.cwd(), "public", "users.json");

const getUsers = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8").trim();
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
};
 //update user
export async function PUT(req: NextRequest, { params }: { params: { userid: string } }) {
  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === parseInt(params.userid));

  if (userIndex === -1) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  // Parse the incoming request body
  const body = await req.json();

  const isNameTaken = users.some(
    (user: any) => user.name === body.name && user.id !== parseInt(params.userid)
  );
  const isEmailTaken = users.some(
    (user: any) => user.email === body.email && user.id !== parseInt(params.userid)
  );

  if (isNameTaken) {
    return Response.json({ message: "Name is already taken!" }, { status: 400 });
  }

  if (isEmailTaken) {
    return Response.json({ message: "Email is already registered!" }, { status: 400 });
  }

  // Update the user data
  users[userIndex] = { ...users[userIndex], ...body };

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  // Return the updated user data
  return Response.json(users[userIndex], { status: 200 });
}


// delete
export async function DELETE(req: NextRequest, { params }: { params: { userid: string } }) {
  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === parseInt(params.userid));

  if (userIndex === -1) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  users.splice(userIndex, 1);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return Response.json({ message: "User deleted" }, { status: 200 });
}
