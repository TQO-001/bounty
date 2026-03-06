import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("bounty_session")?.value
  const pathname = request.nextUrl.pathname
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/applications") || pathname.startsWith("/profile")
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ["/((?!api|_next).*)"] }
