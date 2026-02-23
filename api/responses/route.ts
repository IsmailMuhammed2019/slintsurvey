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
    .map((s: string) => s.trim())
    .find((s: string) => s.startsWith(`${SURVEY_ACCESS_COOKIE_NAME}=`));
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
  console.log("POST /api/responses started [DEBUG]");
  try {
    const headerObj = Object.fromEntries(request.headers.entries());
    console.log("Headers:", JSON.stringify(headerObj));
  } catch (e) {
    console.log("Failed to log headers");
  }
  if (!hasSurveyAccess(request)) {
    console.log("Access denied: missing or invalid cookie");
    return NextResponse.json(
      { error: "Valid access code required to submit the survey." },
      { status: 401 }
    );
  }

  console.log("Reading request body...");
  const body = await request.json().catch(() => null);
  console.log("Body received:", body ? "has body" : "null body");

  const parsed = createResponseSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Validation failed:", parsed.error.format());
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  console.log("Validation successful");
  const answers = parsed.data.answers as SurveyAnswers;
  const fullName = typeof answers.A1 === "string" ? answers.A1.trim() : "";
  const email = typeof answers.A2 === "string" ? answers.A2.trim() : "";

  console.log(`Submitting for: ${fullName} (${email})`);

  if (!fullName || !email) {
    console.log("Missing fullName or email");
    return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
  }

  try {
    console.log("Attempting Prisma create...");
    // Create a timeout promise to prevent hanging - increased to 30s
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database operation timed out after 30s")), 30000)
    );

    const createPromise = prisma.surveyResponse.create({
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

    const startTime = Date.now();
    const response = await Promise.race([createPromise, timeoutPromise]) as any;
    const duration = Date.now() - startTime;

    console.log(`Prisma created successfully in ${duration}ms! ID:`, response.id);
    return NextResponse.json({ response, duration }, { status: 201 });
  } catch (error) {
    console.error("CRITICAL: Survey submission error:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Internal server error during submission.",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
