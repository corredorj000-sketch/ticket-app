import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.log(error);

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

const event = await prisma.event.create({
  data: {
    title: body.title,
    artist: body.artist,
    image: body.image,
    location: body.location,
    description: body.description,
    date: new Date(body.date),

    venue: {
      connect: {
        id: venue?.id
      }
    }
  }
});

    return NextResponse.json(event);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error creando evento" },
      { status: 500 }
    );
  }
}