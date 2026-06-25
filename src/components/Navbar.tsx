import Link from "next/link";
import { readCart } from "@/lib/cart-actions";

export default async function Navbar() {
  const cart = await readCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07070a]/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
            L
          </span>
          Lumen
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="hidden rounded-full px-4 py-2 text-sm text-white/70 transition hover:text-white sm:block"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 2h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 6H6" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
