import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("REGISTER: inicio");
    console.log("REGISTER: email:", body.email);

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    console.log("REGISTER: buscando usuario");

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    console.log("REGISTER: búsqueda OK");

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      );
    }

    console.log("REGISTER: creando password");

    const hashedPassword = await bcrypt.hash(body.password, 10);

    console.log("REGISTER: creando usuario");

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "USER",
      },
    });

    console.log("REGISTER: usuario creado:", user.id);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
