"use client";

import { useRef, useState } from "react";

type CloudinaryImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

const CLOUDINARY_CLOUD_NAME = "oeybnsxo";
const CLOUDINARY_UPLOAD_PRESET = "clickticketco_events";

export default function CloudinaryImageUpload({
  value,
  onChange,
}: CloudinaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("La imagen no puede superar los 8 MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("CLOUDINARY RESPONSE:", {
          status: response.status,
          data,
          cldError: response.headers.get("X-Cld-Error"),
        });

        const cloudinaryError =
          response.headers.get("X-Cld-Error") ||
          data?.error?.message;

        throw new Error(
          cloudinaryError ||
            `Cloudinary rechazó la imagen (${response.status}).`
        );
      }

      if (!data?.secure_url) {
        throw new Error(
          "Cloudinary no devolvió la URL de la imagen."
        );
      }

      onChange(data.secure_url);
      setError("");
    } catch (uploadError) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir la imagen."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    onChange("");
    setError("");
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-zinc-400">
          Imagen del evento
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 px-5 py-6 text-center transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />

              <span className="font-bold text-zinc-300">
                Subiendo imagen...
              </span>
            </div>
          ) : (
            <>
              <div className="text-3xl">↑</div>

              <p className="mt-2 font-bold text-white">
                Seleccionar imagen
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                JPG, PNG o WebP · máximo 8 MB
              </p>
            </>
          )}
        </button>
      </div>

      {value && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
          <div className="relative aspect-[16/7] overflow-hidden">
            <img
              src={value}
              alt="Vista previa del evento"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="absolute right-4 top-4 rounded-xl border border-white/10 bg-black/80 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-black disabled:opacity-50"
            >
              Quitar imagen
            </button>
          </div>

          <div className="border-t border-zinc-800 px-4 py-3">
            <p className="text-xs font-semibold text-green-400">
              Imagen cargada correctamente
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm font-semibold text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}