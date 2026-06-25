"use server";

// Server actions that manage the cart. The Shopify cart ID is stored in an
// httpOnly cookie, so the cart persists across page loads and refreshes.

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  createCart,
  getCart,
  type Cart,
} from "./shopify";

const CART_COOKIE = "cartId";

export async function getOrCreateCart(): Promise<Cart> {
  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;

  if (cartId) {
    const existing = await getCart(cartId);
    if (existing) return existing;
  }

  const cart = await createCart();
  store.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return cart;
}

export async function readCart(): Promise<Cart | null> {
  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return null;
  return getCart(cartId);
}

export async function addItem(variantId: string, quantity = 1): Promise<void> {
  const cart = await getOrCreateCart();
  await apiAddToCart(cart.id, variantId, quantity);
  revalidatePath("/cart");
  revalidatePath("/");
}

export async function removeItem(lineId: string): Promise<void> {
  const cart = await readCart();
  if (!cart) return;
  await apiRemoveFromCart(cart.id, lineId);
  revalidatePath("/cart");
}
