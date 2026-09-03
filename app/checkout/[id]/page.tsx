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

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] =
    useState<OrderData | null>(null);

  const [loading, setLoading] = useState(true);

  const [checkoutError, setCheckoutError] =
    useState("");

  const [preparingPayment, setPreparingPayment] =
    useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setCheckoutError("");

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
          setCheckoutError(
            data.error ||
              "No fue posible cargar el pedido."
          );

          return;
        }

        setOrder(data);
      } catch (error) {
        console.error(
          "LOAD CHECKOUT ERROR:",
          error
        );

        setCheckoutError(
          "No fue posible cargar el checkout. Inténtalo nuevamente."
        );
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
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-zinc-900" />

            <div className="mt-6 h-12 max-w-lg rounded-xl bg-zinc-900" />

            <div className="mt-3 h-5 max-w-md rounded bg-zinc-900" />

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_390px]">
              <div className="h-[540px] rounded-3xl bg-zinc-900" />

              <div className="h-[390px] rounded-3xl bg-zinc-900" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (checkoutError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] text-xl font-black text-red-400">
            !
          </div>

          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            ClickTicketCo
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            No pudimos cargar tu pedido
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
            {checkoutError}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setCheckoutError("");
                setOrder(null);
                setLoading(true);
                window.location.reload();
              }}
              className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200"
            >
              INTENTAR DE NUEVO
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-7 py-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              VOLVER A EVENTOS
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="text-center">
          <p className="text-sm text-zinc-500">
            No encontramos este pedido.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl bg-white px-6 py-3 text-xs font-black text-black transition hover:bg-zinc-200"
          >
            VOLVER A EVENTOS
          </button>
        </div>
      </main>
    );
  }

  const event = order.event;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs font-bold uppercase tracking-wider text-zinc-600 transition hover:text-white"
          >
            ← Volver
          </button>

          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              Checkout
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Finaliza tu compra
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Revisa los datos de tu reserva antes
              de continuar con el pago.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* =========================
              ORDER DETAILS
          ========================= */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0b]">
            {/* Event cover */}
            {event?.image && (
              <div className="relative aspect-[21/7] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/20 to-transparent" />

                <div className="absolute bottom-5 left-5 sm:left-7">
                  <span className="rounded-full border border-white/[0.12] bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                    Reserva creada
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Event */}
              <div className="border-b border-white/[0.06] pb-7">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Evento
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  {event?.title}
                </h2>

                <p className="mt-1 text-sm font-medium text-zinc-500">
                  {event?.artist}
                </p>
              </div>

              {/* Details */}
              <div className="grid gap-6 py-7 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                    Zona
                  </p>

                  <p className="mt-2 text-lg font-black">
                    {order.zone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                    Cantidad
                  </p>

                  <p className="mt-2 text-lg font-black">
                    {order.quantity}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                    Precio por entrada
                  </p>

                  <p className="mt-2 text-lg font-black">
                    {formatPrice(order.unitPrice)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                    Fecha
                  </p>

                  <p className="mt-2 text-sm font-bold leading-5 text-zinc-300">
                    {event?.date
                      ? formatDate(event.date)
                      : "—"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                    Lugar
                  </p>

                  <p className="mt-2 text-sm font-bold text-zinc-300">
                    {event?.venue?.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {event?.venue?.city}
                  </p>
                </div>
              </div>

              {/* Delivery email */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm">
                    @
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                      Correo de entrega
                    </p>

                    <p className="mt-2 truncate text-sm font-black text-zinc-200">
                      {order.user.email}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      Este será el correo utilizado
                      para la comunicación y
                      transferencia de tus entradas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              SUMMARY
          ========================= */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c0c]">
              <div className="border-b border-white/[0.06] p-6 sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Resumen de compra
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Tu pedido
                </h2>
              </div>

              <div className="p-6 sm:p-7">
                {/* Summary item */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black">
                        {order.zone}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {order.quantity}{" "}
                        {order.quantity === 1
                          ? "entrada"
                          : "entradas"}
                      </p>
                    </div>

                    <p className="text-sm font-black">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-zinc-600">
                      Entradas
                    </span>

                    <span className="font-bold text-zinc-300">
                      {formatPrice(order.unitPrice)} ×{" "}
                      {order.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-zinc-600">
                      Estado
                    </span>

                    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/[0.06] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-yellow-400">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-7 border-t border-white/[0.06] pt-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                        Total a pagar
                      </p>

                      <p className="mt-1 text-xs text-zinc-700">
                        Impuestos y cargos incluidos
                      </p>
                    </div>

                    <span className="text-3xl font-black tracking-tight">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Payment button */}
                <button
                  type="button"
                  disabled={preparingPayment}
                  onClick={() => {
                    setPreparingPayment(true);

                    setTimeout(() => {
                      alert(
                        "El siguiente paso será conectar el pago real con Wompi."
                      );

                      setPreparingPayment(false);
                    }, 700);
                  }}
                  className="group mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-black text-black transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {preparingPayment ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      PREPARANDO PAGO...
                    </>
                  ) : (
                    <>
                      PAGAR AHORA
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>

                <div className="mt-5 flex items-start gap-3">
                  <div className="mt-0.5 text-xs text-zinc-600">
                    ✓
                  </div>

                  <p className="text-[11px] leading-5 text-zinc-600">
                    Tu pedido está reservado mientras
                    completas el proceso de pago.
                  </p>
                </div>

                <div className="mt-5 border-t border-white/[0.06] pt-5 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                    ClickTicketCo
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-700">
                    Compra segura de entradas
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}