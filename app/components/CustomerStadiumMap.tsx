"use client";

import { useEffect, useRef, useState } from "react";
import StadiumSVG from "../../public/maps/movistar-arena.svg";

export type CustomerInventoryItem = {
  zone: string;
  quantity: number;
  price: number;
};

type CustomerStadiumMapProps = {
  inventory: CustomerInventoryItem[];
  selectedZone: string;
  onZoneSelect: (zone: CustomerInventoryItem | null) => void;
};

export default function CustomerStadiumMap({
  inventory,
  selectedZone,
  onZoneSelect,
}: CustomerStadiumMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const dragging = useRef(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const positionStart = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const container = mapRef.current;

    if (!container) return;

    const zones = Array.from(
      container.querySelectorAll("path[id]")
    ) as SVGPathElement[];

    const cleanups: (() => void)[] = [];

    zones.forEach((element) => {
      const zoneId = element.id;

      const inventoryItem = inventory.find(
        (item) => item.zone === zoneId
      );

      element.style.cursor =
        inventoryItem && inventoryItem.quantity > 0
          ? "pointer"
          : "not-allowed";

      element.style.transition =
        "opacity 0.2s, stroke 0.2s";

      if (!inventoryItem || inventoryItem.quantity <= 0) {
        element.style.opacity = "0.35";
      } else {
        element.style.opacity =
          selectedZone === zoneId ? "1" : "0.85";
      }

      if (selectedZone === zoneId) {
        element.style.stroke = "white";
        element.style.strokeWidth = "5";
      } else {
        element.style.stroke = "none";
        element.style.strokeWidth = "0";
      }

      const handleMouseEnter = () => {
        if (dragging.current) return;

        if (inventoryItem && inventoryItem.quantity > 0) {
          element.style.opacity = "1";
        }
      };

      const handleMouseLeave = () => {
        if (inventoryItem && inventoryItem.quantity > 0) {
          element.style.opacity =
            selectedZone === zoneId ? "1" : "0.85";
        } else {
          element.style.opacity = "0.35";
        }
      };

      const handleClick = (event: MouseEvent) => {
        if (dragging.current) return;

        event.stopPropagation();

        const item = inventory.find(
          (inventoryItem) =>
            inventoryItem.zone === zoneId
        );

        if (!item || item.quantity <= 0) {
          onZoneSelect(null);
          return;
        }

        zones.forEach((zone) => {
          zone.style.stroke = "none";
          zone.style.strokeWidth = "0";

          const zoneInventory = inventory.find(
            (inventoryItem) =>
              inventoryItem.zone === zone.id
          );

          if (
            zoneInventory &&
            zoneInventory.quantity > 0
          ) {
            zone.style.opacity = "0.85";
          } else {
            zone.style.opacity = "0.35";
          }
        });

        element.style.stroke = "white";
        element.style.strokeWidth = "5";
        element.style.opacity = "1";

        onZoneSelect(item);
      };

      element.addEventListener(
        "mouseenter",
        handleMouseEnter
      );

      element.addEventListener(
        "mouseleave",
        handleMouseLeave
      );

      element.addEventListener(
        "click",
        handleClick
      );

      cleanups.push(() => {
        element.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );

        element.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );

        element.removeEventListener(
          "click",
          handleClick
        );
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [inventory, selectedZone, onZoneSelect]);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    dragging.current = false;

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    positionStart.current = {
      x: position.x,
      y: position.y,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
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

    setPosition({
      x: positionStart.current.x + dx,
      y: positionStart.current.y + dy,
    });
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
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

  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const zoomAmount =
      event.deltaY > 0 ? -0.1 : 0.1;

    setScale((currentScale) => {
      const newScale = Math.min(
        3,
        Math.max(
          0.6,
          currentScale + zoomAmount
        )
      );

      return Number(newScale.toFixed(2));
    });
  };

  const zoomIn = () => {
    setScale((currentScale) =>
      Math.min(
        3,
        Number(
          (currentScale + 0.2).toFixed(2)
        )
      )
    );
  };

  const zoomOut = () => {
    setScale((currentScale) =>
      Math.max(
        0.6,
        Number(
          (currentScale - 0.2).toFixed(2)
        )
      )
    );
  };

  const resetMap = () => {
    setScale(1);

    setPosition({
      x: 0,
      y: 0,
    });

    onZoneSelect(null);
  };

  const availableZones = inventory.filter(
    (item) => item.quantity > 0
  );

  return (
    <div className="w-full overflow-hidden bg-black">
      <div className="border-b border-white/10 bg-[#111] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Selección de entradas
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {selectedZone
                ? selectedZone
                : "Selecciona una zona"}
            </p>
          </div>

          <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400">
            {availableZones.length} zonas disponibles
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
          <button
            type="button"
            onClick={zoomIn}
            className="h-10 w-10 rounded-lg bg-white text-2xl font-black text-black shadow-lg hover:bg-gray-200"
          >
            +
          </button>

          <button
            type="button"
            onClick={zoomOut}
            className="h-10 w-10 rounded-lg bg-white text-2xl font-black text-black shadow-lg hover:bg-gray-200"
          >
            −
          </button>

          <button
            type="button"
            onClick={resetMap}
            className="h-10 w-10 rounded-lg bg-white text-sm font-black text-black shadow-lg hover:bg-gray-200"
          >
            ↺
          </button>
        </div>

        <div
          className="
            relative
            h-[560px]
            w-full
            overflow-hidden
            bg-[#101010]
            cursor-grab
            active:cursor-grabbing
            touch-none
          "
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
            <StadiumSVG
              className="block !h-auto !w-full"
              viewBox="500 50 2350 2450"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
            <div className="whitespace-nowrap rounded-full border border-white/20 bg-black/80 px-4 py-2 text-xs text-white sm:text-sm">
              Toca una zona · Arrastra para mover · rueda para zoom
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2 border-t border-white/10 bg-[#0c0c0c] p-4 sm:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => {
          const available = item.quantity > 0;

          return (
            <button
              key={item.zone}
              type="button"
              disabled={!available}
              onClick={() => {
                if (available) {
                  onZoneSelect(item);
                }
              }}
              className={`rounded-xl border p-4 text-left transition ${
                selectedZone === item.zone
                  ? "border-white bg-white/10"
                  : available
                    ? "border-white/10 bg-[#151515] hover:border-white/30"
                    : "border-white/5 bg-[#101010] opacity-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-black text-white">
                  {item.zone}
                </span>

                <span
                  className={
                    available
                      ? "text-xs font-black text-green-400"
                      : "text-xs font-black text-red-400"
                  }
                >
                  {available
                    ? `${item.quantity} disponibles`
                    : "AGOTADO"}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                Precio por boleta
              </p>

              <p className="text-lg font-black text-white">
                $
                {item.price.toLocaleString(
                  "es-CO"
                )}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}