import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/verify-email'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // For now, allow all routes (authentication will be handled in layout/page components)
  // This prevents middleware bundle size issues
  return NextResponse.next();
}

export const config = {
  // Only run middleware on page routes (not API routes, static files, etc.)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
};
