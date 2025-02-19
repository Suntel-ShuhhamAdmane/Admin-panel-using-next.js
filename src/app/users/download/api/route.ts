import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the JSON file from the public folder
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/users.json`);
    if (!res.ok) throw new Error("Failed to load users.json");

    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
