import { NextResponse } from 'next/server';
import { validateSuperAdminToken } from './src/lib/superAdminAuth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect super-admin routes (excluding login and signup)
  if (pathname.startsWith('/super-admin') && 
      !pathname.includes('/login') && 
      !pathname.includes('/signup')) {
    
    // Get token from cookies
    const token = request.cookies.get('superAdminToken')?.value;
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/super-admin/login', request.url));
    }
    
    // Validate token (synchronous check for middleware)
    try {
      const decoded = require('jsonwebtoken').verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      // Check if token is for super admin
      if (decoded.type !== 'super_admin') {
        return NextResponse.redirect(new URL('/super-admin/login', request.url));
      }
      
      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return NextResponse.redirect(new URL('/super-admin/login', request.url));
      }
      
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/super-admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/super-admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
