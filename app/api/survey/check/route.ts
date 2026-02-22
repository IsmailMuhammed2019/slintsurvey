import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getSurveyAccessCookieValue,
  SURVEY_ACCESS_COOKIE_NAME,
} from "@/lib/survey-access";

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(SURVEY_ACCESS_COOKIE_NAME)?.value;
  const expected = getSurveyAccessCookieValue();

  if (cookieValue === expected) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Access required." }, { status: 401 });
}
