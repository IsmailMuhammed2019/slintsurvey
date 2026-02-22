import { NextResponse } from "next/server";
import { z } from "zod";

import { AUTH_COOKIE_NAME, getAdminPassword, getAdminUsername, getSessionValue } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
  }

  if (parsed.data.username !== getAdminUsername() || parsed.data.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttpsRequest = requestUrl.protocol === "https:" || forwardedProto === "https";

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: getSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
