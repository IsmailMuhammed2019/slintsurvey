import { NextResponse } from "next/server";

import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isRequestAuthenticated(_request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.surveyResponse.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
