import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  await prisma.surveyResponse.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
