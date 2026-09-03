import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Debes iniciar sesión" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        eventZone: {
          select: {
            id: true,
            zone: true,
            price: true,
            event: {
              select: {
                id: true,
                title: true,
                artist: true,
                image: true,
                location: true,
                date: true,
                venue: {
                  select: {
                    name: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (order.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "No tienes acceso a este pedido" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      total: order.total,
      createdAt: order.createdAt,
      user: order.user,
      event: order.eventZone?.event || null,
      zone: order.eventZone?.zone || null,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Error obteniendo el pedido" },
      { status: 500 }
    );
  }
}