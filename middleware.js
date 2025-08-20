import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect super-admin routes (excluding login and signup)
  if (pathname.startsWith('/super-admin') && 
      pathname !== '/super-admin/login' &&
      pathname !== '/super-admin/signup') {
    
    // Get token from cookies
    const token = request.cookies.get('superAdminToken')?.value;
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/super-admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/super-admin/:path*',
  ],
};
