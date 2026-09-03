import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para comprar" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const eventId = String(body.eventId || "");
    const eventZoneId = String(body.eventZoneId || "");
    const quantity = Number(body.quantity);

    if (!eventId || !eventZoneId) {
      return NextResponse.json(
        { error: "Faltan datos del evento o zona" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "La cantidad no es válida" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const zone = await tx.eventZone.findFirst({
        where: {
          id: eventZoneId,
          eventId,
        },
      });

      if (!zone) {
        throw new Error("ZONE_NOT_FOUND");
      }

      if (zone.quantity < quantity) {
        throw new Error("INSUFFICIENT_INVENTORY");
      }

      const updated = await tx.eventZone.updateMany({
        where: {
          id: eventZoneId,
          eventId,
          quantity: {
            gte: quantity,
          },
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      if (updated.count !== 1) {
        throw new Error("INSUFFICIENT_INVENTORY");
      }

      const total = zone.price * quantity;

      const order = await tx.order.create({
        data: {
          userId: user.id,
          eventZoneId: zone.id,
          quantity,
          unitPrice: zone.price,
          total,
          status: "PENDING",
        },
      });

      return {
        orderId: order.id,
        status: order.status,
        quantity: order.quantity,
        unitPrice: order.unitPrice,
        total: order.total,
        zone: zone.zone,
      };
    });

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "ZONE_NOT_FOUND") {
        return NextResponse.json(
          { error: "La zona seleccionada no existe" },
          { status: 404 }
        );
      }

      if (error.message === "INSUFFICIENT_INVENTORY") {
        return NextResponse.json(
          { error: "No hay suficientes entradas disponibles" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error creando el pedido" },
      { status: 500 }
    );
  }
}