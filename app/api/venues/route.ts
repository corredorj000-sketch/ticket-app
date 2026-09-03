import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: [
        {
          city: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json(venues);
  } catch (error) {
    console.error("GET VENUES ERROR:", error);

    return NextResponse.json(
      { error: "Error obteniendo escenarios" },
      { status: 500 }
    );
  }
}