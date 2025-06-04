import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isStudentRoute = req.nextUrl.pathname.startsWith('/student');

    // Redirect admin routes if not admin
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Redirect student routes if not logged in
    if (isStudentRoute && !token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/student/:path*']
}; 