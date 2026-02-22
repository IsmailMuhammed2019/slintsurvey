import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getSurveyAccessCookieValue,
  SURVEY_ACCESS_COOKIE_NAME,
} from "@/lib/survey-access";
import { getCluster, type SurveyAnswers } from "@/lib/survey";

function hasSurveyAccess(request: NextRequest | Request): boolean {
  if ("cookies" in request && typeof request.cookies?.get === "function") {
    const cookieValue = request.cookies.get(SURVEY_ACCESS_COOKIE_NAME)?.value;
    return cookieValue === getSurveyAccessCookieValue();
  }
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;
  const match = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${SURVEY_ACCESS_COOKIE_NAME}=`));
  return match?.split("=")[1] === getSurveyAccessCookieValue();
}

const createResponseSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export async function GET(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const responses = await prisma.surveyResponse.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ responses });
}

export async function POST(request: Request) {
  if (!hasSurveyAccess(request)) {
    return NextResponse.json(
      { error: "Valid access code required to submit the survey." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createResponseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const answers = parsed.data.answers as SurveyAnswers;
  const fullName = typeof answers.A1 === "string" ? answers.A1.trim() : "";
  const email = typeof answers.A2 === "string" ? answers.A2.trim() : "";

  if (!fullName || !email) {
    return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
  }

  const response = await prisma.surveyResponse.create({
    data: {
      fullName,
      email,
      phone: typeof answers.A3 === "string" ? answers.A3 : null,
      location: typeof answers.A4 === "string" ? answers.A4 : null,
      profile: Array.isArray(answers.B1) ? answers.B1 : [],
      cluster: getCluster(answers),
      fundingNeed: typeof answers.G6 === "string" ? answers.G6 : null,
      fundingRange: typeof answers.G8 === "string" ? answers.G8 : null,
      cardInterest: typeof answers.K5 === "string" ? answers.K5 : null,
      timeCommitment: typeof answers.N1 === "string" ? answers.N1 : null,
      answers: answers as object,
    },
  });

  return NextResponse.json({ response }, { status: 201 });
}
