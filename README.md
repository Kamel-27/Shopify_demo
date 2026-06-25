# Lumen — Headless Shopify Storefront

A fast, headless e-commerce storefront built with **Next.js (App Router)** and the
**Shopify Storefront GraphQL API**. Products, cart, and checkout are all powered by a
real Shopify store — no Shopify theme, fully custom front-end.

🔗 **Live demo:** _add your Vercel URL here_

## What it does

- **Home** — product grid pulled live from the Shopify Storefront API
- **Product page** — images, description, price, add-to-cart
- **Cart** — persistent cart (cookie-backed), update/remove items, real subtotal
- **Checkout** — hands off to Shopify's hosted, secure checkout

## Tech & Shopify concepts demonstrated

- **Shopify Storefront API** (GraphQL) — `products`, `product(handle)`, and the
  **Cart API** (`cartCreate`, `cartLinesAdd`, `cartLinesRemove`)
- **Next.js App Router** — Server Components for data fetching, **Server Actions**
  for cart mutations, cookie-based cart persistence
- **TypeScript**, **Tailwind CSS**, `next/image` with the Shopify CDN

The GraphQL client is a thin `fetch` wrapper (no SDK) in
[`src/lib/shopify.ts`](src/lib/shopify.ts), so every query/mutation is visible.

## Run locally

1. Create a free [Shopify Partners](https://partners.shopify.com) account and a
   **development store** (comes with demo products).
2. In the store admin: **Settings → Apps and sales channels → Develop apps →
   Create an app**. Enable Storefront API scopes
   (`unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`),
   install the app, and copy the **Storefront API access token**.
3. Copy `.env.example` to `.env.local` and fill in your store domain + token.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:3000.

## Deploy

Deploy to [Vercel](https://vercel.com): import the repo, add the two env vars
(`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`) in project settings, deploy.

## Project structure

```
src/
  app/
    page.tsx                  # home + product grid
    products/[handle]/        # product detail
    cart/                     # cart + checkout
    layout.tsx                # nav + footer
  components/                 # ProductCard, Navbar, AddToCartButton
  lib/
    shopify.ts                # Storefront API client + GraphQL queries
    cart-actions.ts           # server actions (cart, cookies)
```
