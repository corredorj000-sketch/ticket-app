"use client";

import { useEffect, useState } from "react";
import StadiumSVG from "../../public/maps/movistar-arena.svg";

export default function StadiumMap() {
  const [selectedZone, setSelectedZone] = useState("");

  useEffect(() => {
    const zones = document.querySelectorAll("path");

    zones.forEach((zone: any) => {
      zone.style.transition = "0.2s";

      zone.addEventListener("mouseenter", () => {
        zone.style.opacity = "0.7";
        zone.style.cursor = "pointer";
      });

      zone.addEventListener("mouseleave", () => {
        zone.style.opacity = "1";
      });

      zone.addEventListener("click", () => {
        // limpiar selección anterior
        zones.forEach((z: any) => {
          z.style.stroke = "none";
          z.style.strokeWidth = "0";
        });

        // seleccionar nueva
        zone.style.stroke = "white";
        zone.style.strokeWidth = "5";

        setSelectedZone(zone.id);
      });
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center p-10">

      <div className="text-white text-3xl font-black mb-8">
        Zona seleccionada:
        {" "}
        <span className="text-green-400">
          {selectedZone || "Ninguna"}
        </span>
      </div>

     <div className="w-full overflow-auto flex justify-center">
  <div className="w-[900px]">
    <StadiumSVG />
  </div>
</div>
    </div>
  );
}