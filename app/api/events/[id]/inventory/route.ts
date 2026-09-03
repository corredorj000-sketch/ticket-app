import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type InventoryItem = {
  zone: string;
  quantity: number;
  price: number;
};

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(
      authOptions
    );

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Debes iniciar sesión.",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "No tienes permisos de administrador.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await req.json();

    const title = String(body.title || "").trim();
    const artist = String(body.artist || "").trim();
    const location = String(
      body.location || ""
    ).trim();
    const description = String(
      body.description || ""
    ).trim();

    const inventory = Array.isArray(
      body.inventory
    )
      ? (body.inventory as InventoryItem[])
      : [];

    if (!title || !artist || !location) {
      return NextResponse.json(
        {
          error:
            "Título, artista y ubicación son obligatorios.",
        },
        { status: 400 }
      );
    }

    for (const item of inventory) {
      if (
        !item ||
        typeof item.zone !== "string" ||
        !item.zone.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Hay una zona de inventario inválida.",
          },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 0
      ) {
        return NextResponse.json(
          {
            error: `Cantidad inválida para ${item.zone}.`,
          },
          { status: 400 }
        );
      }

      if (
        !Number.isFinite(item.price) ||
        item.price < 0
      ) {
        return NextResponse.json(
          {
            error: `Precio inválido para ${item.zone}.`,
          },
          { status: 400 }
        );
      }
    }

    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        zones: {
          include: {
            orders: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        {
          error: "Evento no encontrado.",
        },
        { status: 404 }
      );
    }

    const result =
      await prisma.$transaction(async (tx) => {
        const updatedEvent =
          await tx.event.update({
            where: {
              id,
            },
            data: {
              title,
              artist,
              location,
              description,
            },
          });

        const incomingZones = new Set(
          inventory.map((item) => item.zone)
        );

        for (const item of inventory) {
          await tx.eventZone.upsert({
            where: {
              eventId_zone: {
                eventId: id,
                zone: item.zone,
              },
            },
            update: {
              quantity: item.quantity,
              price: item.price,
            },
            create: {
              eventId: id,
              zone: item.zone,
              quantity: item.quantity,
              price: item.price,
            },
          });
        }

        const currentZones =
          await tx.eventZone.findMany({
            where: {
              eventId: id,
            },
            include: {
              orders: {
                select: {
                  id: true,
                },
              },
            },
          });

        for (const zone of currentZones) {
          if (incomingZones.has(zone.zone)) {
            continue;
          }

          /*
           * Si la zona tiene pedidos asociados,
           * no la eliminamos porque romperíamos
           * el historial del pedido.
           *
           * Simplemente la dejamos en 0.
           */
          if (zone.orders.length > 0) {
            await tx.eventZone.update({
              where: {
                id: zone.id,
              },
              data: {
                quantity: 0,
              },
            });

            continue;
          }

          await tx.eventZone.delete({
            where: {
              id: zone.id,
            },
          });
        }

        return updatedEvent;
      });

    return NextResponse.json({
      success: true,
      event: result,
    });
  } catch (error) {
    console.error(
      "UPDATE EVENT INVENTORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error actualizando el evento.",
      },
      { status: 500 }
    );
  }
}