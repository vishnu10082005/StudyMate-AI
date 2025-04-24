import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname


  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/pricing" ||
    path === "/about" ||
    path === "/features"

  const isLoggedIn = request.cookies.get("isLogin")?.value === "true"

  if (!isPublicPath && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }


  if ((path === "/login" || path === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/mindmap/:path*",
    "/todos/:path*",
    "/blog/:path*",
    "/notes/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
}