import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasSession = request.cookies.has("session")

  if (pathname === "/login" || pathname === "/signup") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/feed", request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/feed") || pathname.startsWith("/settings")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  if (pathname === "/") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/feed", request.url))
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/feed/:path*", "/settings/:path*", "/login", "/signup"],
}
