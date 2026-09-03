import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!name) {
      return NextResponse.json(
        {
          error: "El nombre es obligatorio",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error: "El correo es obligatorio",
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener mínimo 6 caracteres",
        },
        { status: 400 }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "El usuario ya existe",
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // El correo no debe impedir que el usuario
    // se cree correctamente si el servicio de email
    // tiene algún problema.
    try {
      await sendWelcomeEmail({
        name: user.name,
        email: user.email,
      });
    } catch (emailError) {
      console.error(
        "WELCOME EMAIL SEND ERROR:",
        emailError
      );
    }

    return NextResponse.json(
      {
        message:
          "Cuenta creada correctamente",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Error creando la cuenta",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}