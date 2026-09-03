import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type InventoryItem = {
  zone: string;
  quantity: number;
  price: number;
};

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        venue: true,
        tickets: true,
        zones: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Error obteniendo eventos",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.venueId) {
      return NextResponse.json(
        {
          error: "Debes seleccionar un escenario",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.title || !body.artist || !body.date) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    const venue = await prisma.venue.findUnique({
      where: {
        id: body.venueId,
      },
    });

    if (!venue) {
      return NextResponse.json(
        {
          error: "El escenario seleccionado no existe",
        },
        {
          status: 400,
        }
      );
    }

    const eventDate = new Date(body.date);

    if (Number.isNaN(eventDate.getTime())) {
      return NextResponse.json(
        {
          error: "La fecha del evento no es válida",
        },
        {
          status: 400,
        }
      );
    }

    const rawInventory = Array.isArray(body.inventory)
      ? body.inventory
      : [];

    const inventory: InventoryItem[] = [];

    for (const item of rawInventory) {
      if (!item || typeof item.zone !== "string") {
        return NextResponse.json(
          {
            error: "Una de las zonas del inventario no es válida",
          },
          {
            status: 400,
          }
        );
      }

      const zone = item.zone.trim();

      if (!zone) {
        return NextResponse.json(
          {
            error: "El nombre de una zona está vacío",
          },
          {
            status: 400,
          }
        );
      }

      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        return NextResponse.json(
          {
            error: `La cantidad de entradas de ${zone} no es válida`,
          },
          {
            status: 400,
          }
        );
      }

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            error: `El precio de ${zone} no es válido`,
          },
          {
            status: 400,
          }
        );
      }

      inventory.push({
        zone,
        quantity,
        price,
      });
    }

    const zoneNames = inventory.map(
      (item) => item.zone
    );

    const uniqueZoneNames = new Set(zoneNames);

    if (
      uniqueZoneNames.size !== zoneNames.length
    ) {
      return NextResponse.json(
        {
          error:
            "No puedes configurar la misma zona más de una vez.",
        },
        {
          status: 400,
        }
      );
    }

    const event = await prisma.$transaction(
      async (tx) => {
        const createdEvent =
          await tx.event.create({
            data: {
              title: body.title,
              artist: body.artist,
              image: body.image || "",
              location:
                body.location || venue.city,
              description:
                body.description || "",
              date: eventDate,
              venueId: venue.id,
            },
          });

        if (inventory.length > 0) {
          await tx.eventZone.createMany({
            data: inventory.map((item) => ({
              eventId: createdEvent.id,
              zone: item.zone,
              quantity: item.quantity,
              price: item.price,
            })),
          });
        }

        return createdEvent;
      }
    );

    const completeEvent =
      await prisma.event.findUnique({
        where: {
          id: event.id,
        },
        include: {
          venue: true,
          tickets: true,
          zones: true,
        },
      });

    return NextResponse.json(
      completeEvent,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE EVENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Error creando evento",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}