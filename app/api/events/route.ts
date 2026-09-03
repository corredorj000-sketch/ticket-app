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
        tickets: {
          select: {
            id: true,
            price: true,
            section: true,
            status: true,
          },
        },
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

    const vipPrice = Number(body.vipPrice || 0);
    const vipQuantity = Number(body.vipQuantity || 0);
    const generalPrice = Number(body.generalPrice || 0);
    const generalQuantity = Number(body.generalQuantity || 0);

    if (!body.title || !body.artist || !body.location || !body.date) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.findFirst();

    if (!venue) {
      return NextResponse.json(
        { error: "No existe ningún escenario configurado" },
        { status: 400 }
      );
    }

    const tickets = [
      ...Array.from({ length: vipQuantity }, () => ({
        price: vipPrice,
        section: "VIP",
        status: "AVAILABLE" as const,
      })),
      ...Array.from({ length: generalQuantity }, () => ({
        price: generalPrice,
        section: "GENERAL",
        status: "AVAILABLE" as const,
      })),
    ];

    const event = await prisma.event.create({
      data: {
        title: body.title,
        artist: body.artist,
        image: body.image || "",
        location: body.location,
        description: body.description || "",
        date: new Date(body.date),

        venue: {
          connect: {
            id: venue.id,
          },
        },

        tickets: {
          create: tickets,
        },
      },
      include: {
        venue: true,
        tickets: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Error creando evento",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}