// app/api/auth/decode-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Named export for GET method
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Access the `httpOnly` token and get its value
  
  if (!token) {
    return NextResponse.json({ message: "Token not found" }, { status: 400 });
  }

  try {
    const decoded = jwtDecode(token); // Decode the JWT token
    return NextResponse.json(decoded); // Send the decoded token to the client
  } catch (err) {
    return NextResponse.json({ message: "Failed to decode token" }, { status: 500 });
  }
}
