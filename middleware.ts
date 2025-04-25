import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get('token')?.value;

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  if (!token) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirect', pathname + search);  // Capture the attempted path
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Verify the token
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY!));
    return NextResponse.next();  // Token is valid, proceed
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/home', '/team', '/teams'],
};
