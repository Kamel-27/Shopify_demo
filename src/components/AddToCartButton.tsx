"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addItem } from "@/lib/cart-actions";

export default function AddToCartButton({
  variantId,
  available,
}: {
  variantId: string;
  available: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      await addItem(variantId, qty);
      setAdded(true);
      router.refresh(); // updates the navbar cart count
      setTimeout(() => setAdded(false), 1600);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {available && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">Quantity</span>
          <div className="flex items-center rounded-full border border-white/15 bg-white/5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-l-full text-lg text-white/80 transition hover:bg-white/10 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center font-medium tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-r-full text-lg text-white/80 transition hover:bg-white/10"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={!available || isPending}
        className="w-full rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {!available
          ? "Sold out"
          : isPending
          ? "Adding…"
          : added
          ? "Added to cart ✓"
          : "Add to cart"}
      </button>
    </div>
  );
}
