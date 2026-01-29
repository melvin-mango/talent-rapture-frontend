// app/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/account",
  "/settings",
  // Add more protected routes as needed
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Get JWT from cookies (optional) or from localStorage via header
    const token = request.cookies.get("jwt")?.value;

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
