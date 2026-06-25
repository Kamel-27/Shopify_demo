import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, formatPrice, saleInfo } from "@/lib/shopify";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

const PERKS = [
  { label: "Secure Shopify checkout" },
  { label: "Live inventory sync" },
  { label: "Demo store — no real charge" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const variant = product.variants[0];
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const sale = saleInfo(price, variant?.compareAtPrice ?? null);
  const images = product.featuredImage
    ? [
        product.featuredImage,
        ...product.images.filter((i) => i.url !== product.featuredImage!.url),
      ]
    : product.images;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-white/50">
        <Link href="/" className="transition hover:text-white">
          Shop
        </Link>
        <span>/</span>
        <span className="text-white/80">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="animate-fade-up">
          <ProductGallery images={images} title={product.title} />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.productType && (
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
              {product.productType}
            </span>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-white">
              {formatPrice(price)}
            </span>
            {sale && (
              <>
                <span className="text-lg text-white/40 line-through">
                  {formatPrice(sale.compareAt)}
                </span>
                <span className="rounded-full bg-gradient-to-br from-rose-500 to-pink-600 px-2.5 py-1 text-xs font-bold text-white">
                  Save {sale.percentOff}%
                </span>
              </>
            )}
          </div>

          <div className="mt-4">
            {product.availableForSale ? (
              <span className="inline-flex items-center gap-2 text-sm text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                In stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                Out of stock
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 leading-relaxed text-white/70">
              {product.description}
            </p>
          )}

          <div className="mt-8 max-w-sm">
            {variant ? (
              <AddToCartButton
                variantId={variant.id}
                available={variant.availableForSale}
              />
            ) : (
              <p className="text-white/60">Unavailable</p>
            )}
          </div>

          <ul className="mt-8 space-y-2 border-t border-white/10 pt-6">
            {PERKS.map((p) => (
              <li
                key={p.label}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-indigo-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 6L9 17l-5-5"
                  />
                </svg>
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
