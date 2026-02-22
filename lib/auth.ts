import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "slint_admin_session";

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME ?? "admin";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "SLINT@Secure2026#Admin";
}

export function getSessionValue(): string {
  return process.env.ADMIN_SESSION_VALUE ?? "slint-admin-authenticated";
}

export function isRequestAuthenticated(request: NextRequest | Request): boolean {
  if ("cookies" in request && typeof request.cookies?.get === "function") {
    const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    return cookieValue === getSessionValue();
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;
  const cookieMatch = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${AUTH_COOKIE_NAME}=`));
  return cookieMatch?.split("=")[1] === getSessionValue();
}
