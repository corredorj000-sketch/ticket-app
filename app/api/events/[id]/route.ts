import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAdminUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
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
        zones: {
          select: {
            id: true,
            zone: true,
            quantity: true,
            price: true,
          },
          orderBy: {
            zone: "asc",
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    return NextResponse.json(
      { error: "Error obteniendo evento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const title = String(body.title || "").trim();
    const artist = String(body.artist || "").trim();
    const image = String(body.image || "").trim();
    const location = String(body.location || "").trim();
    const description = String(body.description || "").trim();
    const date = String(body.date || "");
    const venueId = String(body.venueId || "");

    if (!title || !artist || !date || !venueId) {
      return NextResponse.json(
        {
          error:
            "Nombre, artista, fecha y escenario son obligatorios",
        },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json(
        { error: "Escenario no encontrado" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "La fecha no es válida" },
        { status: 400 }
      );
    }

    const inventory = Array.isArray(body.inventory)
      ? body.inventory
      : [];

    const result = await prisma.$transaction(async (tx) => {
      const updatedEvent = await tx.event.update({
        where: { id },
        data: {
          title,
          artist,
          image,
          location,
          description,
          date: parsedDate,
          venueId,
        },
      });

      for (const item of inventory) {
        const zone = String(item.zone || "").trim();
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        if (!zone) {
          continue;
        }

        if (
          !Number.isInteger(quantity) ||
          quantity < 0
        ) {
          throw new Error(
            `Cantidad inválida para la zona ${zone}`
          );
        }

        if (!Number.isFinite(price) || price < 0) {
          throw new Error(
            `Precio inválido para la zona ${zone}`
          );
        }

        await tx.eventZone.upsert({
          where: {
            eventId_zone: {
              eventId: id,
              zone,
            },
          },
          update: {
            quantity,
            price,
          },
          create: {
            eventId: id,
            zone,
            quantity,
            price,
          },
        });
      }

      return updatedEvent;
    });

    return NextResponse.json({
      message: "Evento actualizado correctamente",
      event: result,
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error actualizando evento",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        zones: {
          select: {
            id: true,
          },
        },
        tickets: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      /*
       * Primero eliminamos los pedidos que apuntan
       * a las zonas del evento.
       */
      if (event.zones.length > 0) {
        await tx.order.deleteMany({
          where: {
            eventZoneId: {
              in: event.zones.map((zone) => zone.id),
            },
          },
        });
      }

      /*
       * Luego eliminamos los pedidos que apuntan
       * directamente a tickets.
       */
      if (event.tickets.length > 0) {
        await tx.order.deleteMany({
          where: {
            ticketId: {
              in: event.tickets.map(
                (ticket) => ticket.id
              ),
            },
          },
        });
      }

      /*
       * Ahora ya podemos eliminar zonas y tickets.
       */
      await tx.eventZone.deleteMany({
        where: {
          eventId: id,
        },
      });

      await tx.ticket.deleteMany({
        where: {
          eventId: id,
        },
      });

      /*
       * Finalmente eliminamos el evento.
       */
      await tx.event.delete({
        where: {
          id,
        },
      });
    });

    return NextResponse.json({
      message: "Evento eliminado correctamente",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return NextResponse.json(
      {
        error:
          "No se pudo eliminar el evento",
      },
      { status: 500 }
    );
  }
}