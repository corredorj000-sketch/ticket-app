import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  await prisma.event.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}