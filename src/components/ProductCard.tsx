import Link from "next/link";
import Image from "next/image";
import {
  formatPrice,
  saleInfo,
  type Product,
} from "@/lib/shopify";

export default function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const sale = saleInfo(price, product.compareAtPriceRange.minVariantPrice);
  const soldOut = !product.availableForSale;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              soldOut ? "opacity-40 grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/30">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {sale && (
            <span className="rounded-full bg-gradient-to-br from-rose-500 to-pink-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              −{sale.percentOff}%
            </span>
          )}
        </div>
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white/80 backdrop-blur">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.productType && (
          <span className="text-xs font-medium uppercase tracking-wider text-white/40">
            {product.productType}
          </span>
        )}
        <h3 className="font-medium leading-tight text-white/90 group-hover:text-white">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-semibold text-white">{formatPrice(price)}</span>
          {sale && (
            <span className="text-sm text-white/40 line-through">
              {formatPrice(sale.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
