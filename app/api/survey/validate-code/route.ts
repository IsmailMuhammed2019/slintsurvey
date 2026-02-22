import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getSurveyAccessCode,
  getSurveyAccessCookieValue,
  SURVEY_ACCESS_COOKIE_NAME,
} from "@/lib/survey-access";

const validateSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = validateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Access code is required." }, { status: 400 });
  }

  const expected = getSurveyAccessCode();
  if (parsed.data.code.trim() !== expected) {
    return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttpsRequest = requestUrl.protocol === "https:" || forwardedProto === "https";

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SURVEY_ACCESS_COOKIE_NAME,
    value: getSurveyAccessCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
