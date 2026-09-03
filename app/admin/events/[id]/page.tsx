import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminEventEditor from "./AdminEventEditor";

export default async function AdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      venue: true,
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
    redirect("/admin");
  }

  return (
    <AdminEventEditor
      event={{
        id: event.id,
        title: event.title,
        artist: event.artist,
        image: event.image,
        location: event.location,
        description: event.description,
        date: event.date.toISOString(),
        venue: event.venue,
        zones: event.zones,
      }}
    />
  );
}