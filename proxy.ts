import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  isConfigured,
  verifySessionToken,
} from "@/app/lib/admin-auth";

/**
 * Guards the admin area. Pages get redirected to the login screen and API
 * routes get a 401. This is only the first gate — every admin page and route
 * also re-checks the session itself, as the Next.js docs recommend (Proxy
 * should not be the sole session check).
 *
 * Next 16 note: `proxy.ts` replaces the old `middleware.ts` convention.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login screen must stay reachable, otherwise you could never sign in.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Without a password there's no session to check; admin pages render
  // setup instructions instead.
  if (!isConfigured()) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (verifySessionToken(token)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
};
