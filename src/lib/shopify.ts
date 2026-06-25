// Minimal Shopify Storefront API client + typed queries.
// Talks to a Shopify dev store over GraphQL (no SDK, just fetch).

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-07";

const endpoint = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

export type Money = { amount: string; currencyCode: string };

export type ProductImage = { url: string; altText: string | null };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  productType: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string; featuredImage: ProductImage | null };
    price: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  cache: RequestCache = "no-store"
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      "Missing Shopify env vars. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in .env.local"
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache,
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("\n"));
  }
  return json.data as T;
}

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    availableForSale
    productType
    featuredImage { url altText }
    images(first: 6) { nodes { url altText } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
`;

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: { nodes: ProductImage[] };
  variants: { nodes: ProductVariant[] };
};

function normalize(p: RawProduct): Product {
  return { ...p, images: p.images.nodes, variants: p.variants.nodes };
}

export async function getProducts(first = 12): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query Products($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) {
          nodes { ...ProductFields }
        }
      }
    `,
    { first }
  );
  return data.products.nodes.map(normalize);
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: RawProduct | null }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query Product($handle: String!) {
        product(handle: $handle) { ...ProductFields }
      }
    `,
    { handle }
  );
  return data.product ? normalize(data.product) : null;
}

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product { title handle featuredImage { url altText } }
          }
        }
      }
    }
  }
`;

type RawCart = Omit<Cart, "lines"> & { lines: { nodes: CartLine[] } };
const flattenCart = (c: RawCart): Cart => ({ ...c, lines: c.lines.nodes });

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: RawCart } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation { cartCreate { cart { ...CartFields } } }
    `
  );
  return flattenCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      query Cart($cartId: ID!) { cart(id: $cartId) { ...CartFields } }
    `,
    { cartId }
  );
  return data.cart ? flattenCart(data.cart) : null;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: RawCart } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
    `,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return flattenCart(data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: RawCart } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
      }
    `,
    { cartId, lineIds: [lineId] }
  );
  return flattenCart(data.cartLinesRemove.cart);
}

export function formatPrice(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

/** Returns the compare-at price if it's higher than the current price. */
export function saleInfo(price: Money, compareAt: Money | null) {
  if (!compareAt) return null;
  const now = parseFloat(price.amount);
  const was = parseFloat(compareAt.amount);
  if (was <= now) return null;
  return { compareAt, percentOff: Math.round((1 - now / was) * 100) };
}
