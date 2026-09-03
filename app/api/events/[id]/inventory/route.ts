import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const inventory = await prisma.eventZone.findMany({
      where: {
        eventId: id,
      },
      orderBy: {
        zone: "asc",
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("GET INVENTORY ERROR:", error);

    return NextResponse.json(
      {
        error: "Error obteniendo inventario",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}