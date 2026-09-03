"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

type OrderData = {
  id: string;
  status: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  event: {
    id: string;
    title: string;
    artist: string;
    image: string;
    location: string;
    date: string;
    venue: {
      name: string;
      city: string;
    };
  } | null;

  zone: string | null;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] =
    useState<OrderData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const session = await getSession();

        if (!session?.user?.email) {
          router.push(
            `/login?callbackUrl=${encodeURIComponent(
              `/checkout/${id}`
            )}`
          );

          return;
        }

        const response = await fetch(
          `/api/orders/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.error ||
              "No fue posible cargar el pedido."
          );

          router.push("/");
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error(
          "LOAD CHECKOUT ERROR:",
          error
        );

        alert(
          "No fue posible cargar el checkout."
        );

        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadOrder();
    }
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-zinc-500">
            Cargando tu compra...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  const event = order.event;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">

        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Finaliza tu compra
          </h1>

          <p className="mt-3 text-zinc-500">
            Revisa los datos antes de continuar
            con el pago.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          <section className="rounded-[28px] border border-white/10 bg-[#111] p-6">

            <div className="border-b border-white/10 pb-6">

              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Evento
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {event?.title}
              </h2>

              <p className="mt-1 text-zinc-400">
                {event?.artist}
              </p>

            </div>

            <div className="space-y-6 py-6">

              <div className="flex justify-between gap-6">
                <span className="text-zinc-500">
                  Zona
                </span>

                <span className="font-black">
                  {order.zone}
                </span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="text-zinc-500">
                  Cantidad
                </span>

                <span className="font-black">
                  {order.quantity}
                </span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="text-zinc-500">
                  Precio por boleta
                </span>

                <span className="font-black">
                  $
                  {order.unitPrice.toLocaleString(
                    "es-CO"
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="text-zinc-500">
                  Lugar
                </span>

                <span className="text-right font-black">
                  {event?.venue?.name}
                  <br />
                  <span className="text-sm text-zinc-500">
                    {event?.venue?.city}
                  </span>
                </span>
              </div>

              <div className="flex justify-between gap-6">
                <span className="text-zinc-500">
                  Fecha
                </span>

                <span className="font-black">
                  {event?.date
                    ? new Date(
                        event.date
                      ).toLocaleDateString(
                        "es-CO"
                      )
                    : ""}
                </span>
              </div>

            </div>

            <div className="border-t border-white/10 pt-6">

              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Correo de entrega
              </p>

              <p className="mt-2 text-lg font-black">
                {order.user.email}
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Este será el correo utilizado para
                la comunicación y transferencia de
                tus entradas.
              </p>

            </div>

          </section>

          <aside className="h-fit rounded-[28px] border border-white/10 bg-[#111] p-6 lg:sticky lg:top-6">

            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Resumen
            </p>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">
                  {order.quantity} boleta(s)
                </span>

                <span className="font-bold">
                  $
                  {order.total.toLocaleString(
                    "es-CO"
                  )}
                </span>
              </div>

            </div>

            <div className="mt-6 border-t border-white/10 pt-6">

              <div className="flex items-end justify-between gap-4">

                <span className="text-zinc-500">
                  Total
                </span>

                <span className="text-3xl font-black">
                  $
                  {order.total.toLocaleString(
                    "es-CO"
                  )}
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                alert(
                  "El siguiente paso será conectar el pago real con Wompi."
                );
              }}
              className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-lg font-black text-black transition hover:scale-[1.01]"
            >
              PAGAR AHORA
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
              Tu pedido está reservado mientras
              completamos el proceso de pago.
            </p>

          </aside>

        </div>
      </div>
    </main>
  );
}