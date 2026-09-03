import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: {
        id,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Evento eliminado",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return NextResponse.json(
      { error: "Error eliminando evento" },
      { status: 500 }
    );
  }
}