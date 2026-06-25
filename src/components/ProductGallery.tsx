"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/shopify";

export default function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/30">
        No image
      </div>
    );
  }

  const main = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image
          src={main.url}
          alt={main.altText ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                i === active
                  ? "border-indigo-400 ring-2 ring-indigo-400/40"
                  : "border-white/10 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${title} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
