import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'users.json');

// Handle GET request
export async function GET() {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const users = JSON.parse(jsonData);

  return Response.json(users, { status: 200 });
}

//add user

export async function POST(req: Request) {
  const { name, email, status } = await req.json();

  if (!name || !email) {
    return Response.json({ message: "Name and Email are required!" }, { status: 400 });
  }

  // Read existing users from the file
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const users = JSON.parse(jsonData);

  // Check for uniqueness of name and email
  const isNameTaken = users.some(user => user.name.toLowerCase() === name.toLowerCase());
  const isEmailTaken = users.some(user => user.email.toLowerCase() === email.toLowerCase());

  if (isNameTaken) {
    return Response.json({ message: "Name is already taken!" }, { status: 400 });
  }

  if (isEmailTaken) {
    return Response.json({ message: "Email is already registered!" }, { status: 400 });
  }

  // Generate a new ID 
  const newId = users.length ? users[users.length - 1].id + 1 : 1;

  // Add new user with the generated ID
  const newUser = { id: newId, name, email, status };

  // Add the new user to the list of users
  users.push(newUser);

  // Save the updated list to the file
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  // Return the success response
  return Response.json({ message: "User added successfully!", newUser }, { status: 201 });
}


