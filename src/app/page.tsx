import Link from "next/link";
import { getProducts, type Product } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

const FEATURES = [
  { title: "Headless", desc: "Custom Next.js front-end, no Shopify theme." },
  { title: "Real-time", desc: "Live products & inventory from the Storefront API." },
  { title: "Secure checkout", desc: "Handed off to Shopify's hosted checkout." },
];

export default async function Home() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts(12);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero */}
      <section className="relative py-20 text-center sm:py-28">
        <div className="animate-fade-up">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Headless commerce demo
          </span>
          <h1 className="mx-auto max-w-3xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            Shop the collection,
            <br className="hidden sm:block" /> beautifully fast.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            A storefront powered by Next.js and the Shopify Storefront API —
            real products, a real cart, and real checkout.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="#products"
              className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90"
            >
              Browse products
            </Link>
            <a
              href="https://shopify.dev/docs/api/storefront"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Storefront API ↗
            </a>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="mt-1 text-sm text-white/50">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Products */}
      <section id="products" className="scroll-mt-24 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured products</h2>
            <p className="mt-1 text-sm text-white/50">
              {products.length > 0
                ? `${products.length} products from the store`
                : "Live from Shopify"}
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-200">
            <p className="font-semibold">Couldn’t load products.</p>
            <p className="mt-1 text-sm">
              Check your <code>.env.local</code> credentials. ({error})
            </p>
          </div>
        ) : products.length === 0 ? (
          <p className="text-white/60">No products found in this store yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
