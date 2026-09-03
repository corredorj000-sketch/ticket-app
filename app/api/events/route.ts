import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        venue: true,
        tickets: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return NextResponse.json(
      { error: "Error obteniendo eventos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const venue = await prisma.venue.findFirst();

    if (!venue) {
      return NextResponse.json(
        { error: "No existe ningún escenario configurado" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        artist: body.artist,
        image: body.image || "",
        location: body.location,
        description: body.description || "",
        date: new Date(body.date),
        venueId: venue.id,
      },
    });

    const vipQuantity = Math.max(
      0,
      parseInt(body.vipQuantity || "0", 10)
    );

    const generalQuantity = Math.max(
      0,
      parseInt(body.generalQuantity || "0", 10)
    );

    const vipPrice = Number(body.vipPrice || 0);
    const generalPrice = Number(body.generalPrice || 0);

    if (vipQuantity > 0) {
      await prisma.ticket.createMany({
        data: Array.from({ length: vipQuantity }, () => ({
          eventId: event.id,
          price: vipPrice,
          section: "VIP",
          status: "AVAILABLE" as const,
        })),
      });
    }

    if (generalQuantity > 0) {
      await prisma.ticket.createMany({
        data: Array.from({ length: generalQuantity }, () => ({
          eventId: event.id,
          price: generalPrice,
          section: "GENERAL",
          status: "AVAILABLE" as const,
        })),
      });
    }

    const completeEvent = await prisma.event.findUnique({
      where: {
        id: event.id,
      },
      include: {
        venue: true,
        tickets: true,
      },
    });

    return NextResponse.json(completeEvent);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Error creando evento",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}