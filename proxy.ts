import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isProtectedRoute = pathname.startsWith("/") || pathname.startsWith("/settings")

  const hasSession = request.cookies.has("session")

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["//:path*", "/settings/:path*", "/login", "/signup"],
}
