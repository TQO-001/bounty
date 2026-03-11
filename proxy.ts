import { NextRequest, NextResponse } from "next/server"

// Next.js 16: middleware.ts is renamed to proxy.ts and the exported function
// must be named `proxy` (not `middleware`). The edge runtime is no longer
// supported here; proxy.ts always runs on the Node.js runtime.
export function proxy(request: NextRequest) {
  // FIXED: was checking "bounty_session" but auth/index.ts sets "bounty_token"
  const token = request.cookies.get("bounty_token")?.value
  const pathname = request.nextUrl.pathname

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/applications") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/contacts") ||
    pathname.startsWith("/calendar")

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
