import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, getSessionValue } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/responses"];

export function proxy(request: NextRequest) {
  console.log(`[PROXY-ENTRY] ${request.method} ${request.nextUrl.pathname}`);
  const path = request.nextUrl.pathname;
  console.log(`[PROXY] ${request.method} ${path}`);
  const isProtected = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  if (!isProtected) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieValue === getSessionValue()) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", path);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/responses/:path*", "/api/:path*"],
};
