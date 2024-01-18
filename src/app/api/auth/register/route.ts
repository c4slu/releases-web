import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET(request: Request) {
  // ...
  return NextResponse.json({ message: "RequestRunning..." });
}

// Handles POST requests to /api
export async function POST(request: Request) {
  const data = await request.json();

  return NextResponse.json({ data, message: "Sucess..." });
}
