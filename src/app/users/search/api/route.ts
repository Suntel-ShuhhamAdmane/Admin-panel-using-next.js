import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Path to the JSON file
const filePath = path.join(process.cwd(), 'public', 'users.json');

// API Route handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  
  // Read the JSON data from the file
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const users = JSON.parse(jsonData);

  // If there's a search query, filter based on all fields
  if (query) {
    const searchResults = users.filter((user) =>
     
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    return NextResponse.json(searchResults, { status: 200 });
  }

  // If no query, return all users
  return NextResponse.json(users, { status: 200 });
}
