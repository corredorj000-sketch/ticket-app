"use client";

import { useEffect, useRef, useState } from "react";

type InventoryItem = {
  zone: string;
  quantity: number;
  price: number;
};

type StadiumMapProps = {
  inventory?: InventoryItem[];
  onInventoryChange?: (inventory: InventoryItem[]) => void;
  adminMode?: boolean;
};

const ZONE_SELECTOR =
  'path[id^="zona-"], path[id="Platea"], path[id="Tribu-fan-nte"], path[id="Tribu-fan-sur"]';

export default function StadiumMap({
  inventory = [],
  onInventoryChange,
  adminMode = false,
}: StadiumMapProps) {
  const svgHostRef = useRef<HTMLDivElement>(null);

  const [selectedZone, setSelectedZone] = useState("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const dragging = useRef(false);
  const pointerDown = useRef(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const positionStart = useRef({ x: 0, y: 0 });

  /*
   * CARGAR SVG REALMENTE DENTRO DEL DOM
   */
  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    let cancelled = false;

    const loadSvg = async () => {
      try {
        const response = await fetch("/maps/movistar-arena.svg");

        if (!response.ok) {
          throw new Error("No se pudo cargar el mapa");
        }

        const svgText = await response.text();

        if (cancelled) return;

        host.innerHTML = svgText;

        const svg = host.querySelector("svg");

        if (!svg) {
          console.error("El archivo no contiene un SVG válido");
          return;
        }

        svg.removeAttribute("width");
        svg.removeAttribute("height");

        svg.setAttribute("viewBox", "0 0 3300 2550");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.display = "block";
        svg.style.pointerEvents = "auto";

        /*
         * Desactivar elementos que pueden tapar las zonas.
         */
        svg
          .querySelectorAll(
            "text, tspan, rect, circle, ellipse, line, polyline, polygon"
          )
          .forEach((element) => {
            (element as SVGElement).style.pointerEvents = "none";
          });

        /*
         * Desactivar todos los paths.
         */
        svg.querySelectorAll("path").forEach((path) => {
          path.style.pointerEvents = "none";
        });

        /*
         * Activar únicamente las zonas.
         */
        const zones = Array.from(
          svg.querySelectorAll<SVGPathElement>(ZONE_SELECTOR)
        );

        console.log("ZONAS ENCONTRADAS:", zones.length);

        zones.forEach((zone) => {
          zone.style.pointerEvents = "all";
          zone.style.cursor = "pointer";
          zone.style.transition =
            "opacity 0.15s ease, filter 0.15s ease, stroke 0.15s ease";

          zone.style.opacity = "1";

          const handleMouseEnter = () => {
            if (dragging.current) return;

            if (zone.id !== selectedZone) {
              zone.style.opacity = "0.7";
              zone.style.filter = "brightness(1.2)";
            }
          };

          const handleMouseLeave = () => {
            if (zone.id !== selectedZone) {
              zone.style.opacity = "1";
              zone.style.filter = "none";
            }
          };

          const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            if (dragging.current) return;

            const zoneId = zone.id;

            console.log("ZONA CLICKEADA:", zoneId);

            zones.forEach((otherZone) => {
              otherZone.style.opacity = "1";
              otherZone.style.filter = "none";
              otherZone.style.stroke = "none";
              otherZone.style.strokeWidth = "0";
            });

            zone.style.opacity = "0.65";
            zone.style.filter = "brightness(1.3)";
            zone.style.stroke = "white";
            zone.style.strokeWidth = "4";

            setSelectedZone(zoneId);

            const existing = inventory.find(
              (item) => item.zone === zoneId
            );

            if (existing) {
              setQuantity(String(existing.quantity));
              setPrice(String(existing.price));
            } else {
              setQuantity("");
              setPrice("");
            }
          };

          zone.addEventListener(
            "mouseenter",
            handleMouseEnter
          );

          zone.addEventListener(
            "mouseleave",
            handleMouseLeave
          );

          zone.addEventListener("click", handleClick);

          (
            zone as SVGPathElement & {
              __enter?: () => void;
              __leave?: () => void;
              __click?: (event: MouseEvent) => void;
            }
          ).__enter = handleMouseEnter;

          (
            zone as SVGPathElement & {
              __enter?: () => void;
              __leave?: () => void;
              __click?: (event: MouseEvent) => void;
            }
          ).__leave = handleMouseLeave;

          (
            zone as SVGPathElement & {
              __enter?: () => void;
              __leave?: () => void;
              __click?: (event: MouseEvent) => void;
            }
          ).__click = handleClick;
        });
      } catch (error) {
        console.error("ERROR CARGANDO MAPA:", error);
      }
    };

    loadSvg();

    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, [inventory, selectedZone]);

  /*
   * ARRASTRAR MAPA
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const target = event.target as Element | null;

    if (target?.closest(ZONE_SELECTOR)) {
      pointerDown.current = false;
      dragging.current = false;
      return;
    }

    pointerDown.current = true;
    dragging.current = false;

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    positionStart.current = {
      x: position.x,
      y: position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!pointerDown.current) return;

    if (
      !event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      return;
    }

    const dx =
      event.clientX - dragStart.current.x;

    const dy =
      event.clientY - dragStart.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragging.current = true;
    }

    if (dragging.current) {
      setPosition({
        x: positionStart.current.x + dx,
        y: positionStart.current.y + dy,
      });
    }
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    pointerDown.current = false;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    setTimeout(() => {
      dragging.current = false;
    }, 50);
  };

  /*
   * ZOOM
   */
  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const amount =
      event.deltaY > 0 ? -0.1 : 0.1;

    setScale((current) => {
      const next = Math.min(
        3,
        Math.max(0.6, current + amount)
      );

      return Number(next.toFixed(2));
    });
  };

  const zoomIn = () => {
    setScale((current) =>
      Math.min(
        3,
        Number((current + 0.2).toFixed(2))
      )
    );
  };

  const zoomOut = () => {
    setScale((current) =>
      Math.max(
        0.6,
        Number((current - 0.2).toFixed(2))
      )
    );
  };

  const resetMap = () => {
    setScale(1);
    setPosition({
      x: 0,
      y: 0,
    });
  };

  /*
   * GUARDAR INVENTARIO
   */
  const saveZoneInventory = () => {
    if (!selectedZone) {
      alert("Primero selecciona una zona.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      alert("Ingresa una cantidad válida.");
      return;
    }

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      alert("Ingresa un precio válido.");
      return;
    }

    const newItem: InventoryItem = {
      zone: selectedZone,
      quantity: parsedQuantity,
      price: parsedPrice,
    };

    onInventoryChange?.([
      ...inventory.filter(
        (item) => item.zone !== selectedZone
      ),
      newItem,
    ]);
  };

  /*
   * QUITAR INVENTARIO
   */
  const removeZoneInventory = () => {
    if (!selectedZone) return;

    onInventoryChange?.(
      inventory.filter(
        (item) => item.zone !== selectedZone
      )
    );

    setQuantity("");
    setPrice("");
  };

  const selectedInventory = inventory.find(
    (item) => item.zone === selectedZone
  );

  return (
    <div className="w-full overflow-hidden bg-black">
      {/* ENCABEZADO */}
      <div className="py-4 text-center text-lg font-black text-white sm:text-xl">
        Zona seleccionada:{" "}
        <span className="text-green-400">
          {selectedZone || "Ninguna"}
        </span>
      </div>

      {/* PANEL ADMIN */}
      {adminMode && selectedZone && (
        <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#151515] p-4">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Zona seleccionada
            </p>

            <p className="text-2xl font-black text-white">
              {selectedZone}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-white">
                Boletas disponibles
              </label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="Ej: 5"
                className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-white">
                Precio por boleta
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="Ej: 180000"
                className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-white outline-none focus:border-green-400"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={saveZoneInventory}
              className="rounded-xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400"
            >
              {selectedInventory
                ? "ACTUALIZAR ZONA"
                : "AGREGAR INVENTARIO"}
            </button>

            {selectedInventory && (
              <button
                type="button"
                onClick={removeZoneInventory}
                className="rounded-xl border border-red-500/50 px-5 py-3 font-black text-red-400 hover:bg-red-500/10"
              >
                QUITAR ZONA
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAPA */}
      <div className="relative w-full">
        {/* CONTROLES */}
        <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
          <button
            type="button"
            onClick={zoomIn}
            className="h-10 w-10 rounded-lg bg-white text-2xl font-black text-black shadow-lg"
          >
            +
          </button>

          <button
            type="button"
            onClick={zoomOut}
            className="h-10 w-10 rounded-lg bg-white text-2xl font-black text-black shadow-lg"
          >
            −
          </button>

          <button
            type="button"
            onClick={resetMap}
            className="h-10 w-10 rounded-lg bg-white text-sm font-black text-black shadow-lg"
          >
            ↺
          </button>
        </div>

        {/* VENTANA */}
        <div
          className="
            relative
            h-[560px]
            w-full
            overflow-hidden
            bg-[#101010]
            cursor-grab
            active:cursor-grabbing
          "
          style={{
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <div
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              width: "100%",
              maxWidth: "1100px",
              transform: `
                translate(-50%, -50%)
                translate(${position.x}px, ${position.y}px)
                scale(${scale})
              `,
            }}
          >
            <div
              ref={svgHostRef}
              className="w-full"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
            <div className="whitespace-nowrap rounded-full border border-white/20 bg-black/80 px-4 py-2 text-xs text-white sm:text-sm">
              Haz clic en una zona · Arrastra para mover ·
              rueda para zoom
            </div>
          </div>
        </div>
      </div>

      {/* INVENTARIO */}
      {adminMode && inventory.length > 0 && (
        <div className="p-4">
          <h3 className="mb-3 text-lg font-black text-white">
            Inventario del evento
          </h3>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inventory.map((item) => (
              <div
                key={item.zone}
                className="rounded-xl border border-white/10 bg-[#151515] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-white">
                    {item.zone}
                  </span>

                  <span
                    className={
                      item.quantity > 0
                        ? "text-sm font-bold text-green-400"
                        : "text-sm font-bold text-red-400"
                    }
                  >
                    {item.quantity > 0
                      ? "DISPONIBLE"
                      : "AGOTADO"}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-300">
                  {item.quantity} boletas
                </div>

                <div className="text-sm font-bold text-white">
                  $
                  {item.price.toLocaleString(
                    "es-CO"
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}