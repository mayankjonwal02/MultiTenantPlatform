import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/invite",
]

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")
  const pathname = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")

  if (!token && !isPublicRoute && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/invite/:path*",
  ],
}
