import Image from "next/image";
import Link from "next/link";
import { readCart, removeItem } from "@/lib/cart-actions";
import { formatPrice } from "@/lib/shopify";

export default async function CartPage() {
  const cart = await readCart();
  const lines = cart?.lines ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-6 w-6 text-white/50"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 2h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 6H6" />
            </svg>
          </div>
          <p className="text-white/60">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-3">
            {lines.map((line) => {
              const img = line.merchandise.product.featuredImage;
              const lineTotal = {
                amount: (
                  parseFloat(line.merchandise.price.amount) * line.quantity
                ).toString(),
                currencyCode: line.merchandise.price.currencyCode,
              };
              return (
                <li
                  key={line.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                    {img && (
                      <Image
                        src={img.url}
                        alt={img.altText ?? line.merchandise.product.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className="font-medium text-white/90 hover:text-white hover:underline"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-white/50">
                      {line.merchandise.title !== "Default Title"
                        ? line.merchandise.title + " · "
                        : ""}
                      Qty {line.quantity} ·{" "}
                      {formatPrice(line.merchandise.price)} each
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {formatPrice(lineTotal)}
                  </p>
                  <form action={removeItem.bind(null, line.id)}>
                    <button
                      type="submit"
                      className="rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-rose-400"
                      aria-label="Remove item"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          d="M18 6L6 18M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {cart && formatPrice(cart.cost.subtotalAmount)}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/50">
              Shipping and taxes calculated at checkout.
            </p>
            <a
              href={cart?.checkoutUrl}
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
            >
              Checkout
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <Link
              href="/"
              className="mt-3 block text-center text-sm text-white/50 transition hover:text-white"
            >
              Continue shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
