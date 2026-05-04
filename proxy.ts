import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // If not logged in and trying to access dashboard
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If logged in, check role-based access
  if (session) {
    const role = (session.user as any)?.role
    const volunteerType = (session.user as any)?.volunteer_type

    // Only admins can access admin routes
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Only finance volunteers can access finance routes
    if (
      pathname.startsWith("/dashboard/finance") &&
      !(role === "admin" || volunteerType === "finance")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}