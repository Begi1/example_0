// app/api/auth/get-token/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Handle GET request
export async function GET(req: NextRequest) {
  // Read the token from the cookies
  const token = req.cookies.get('token'); // Next.js 13 uses `req.cookies.get()`

  if (token) {
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ message: 'No token found' }, { status: 404 });
  }
}
