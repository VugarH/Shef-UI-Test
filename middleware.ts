import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/profile", "/orders", "/favorites", "/settings", "/notifications"]

// List of paths that should redirect to dashboard if already authenticated
const authPaths = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session cookie
  const hasSessionCookie = request.cookies.has("session")

  // If the user is already authenticated and trying to access login/signup
  if (isAuthPath(pathname) && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // For protected paths, redirect to login if not authenticated
  if (isProtectedPath(pathname) && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

function isAuthPath(pathname: string): boolean {
  return authPaths.some((path) => pathname === path)
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
