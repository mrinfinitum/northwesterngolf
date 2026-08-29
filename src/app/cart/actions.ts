"use server";

import {
  addCartLine,
  CartOperationError,
  createCart,
  getCartById,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/cart";
import {
  readCartId,
  writeCartId,
} from "@/lib/shopify/cart-session";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";
import type {
  CartActionResult,
  CheckoutActionResult,
} from "@/lib/shopify/types";

const MAX_LINE_QUANTITY = 99;
const VARIANT_ID_PREFIX = "gid://shopify/ProductVariant/";
const LINE_ID_PREFIX = "gid://shopify/CartLine/";

function unavailable(): CartActionResult {
  return {
    cart: null,
    message: "Retail cart is configured but not connected yet.",
    ok: false,
  };
}

function validId(value: string, prefix: string) {
  return value.startsWith(prefix) && value.length > prefix.length && value.length <= 512;
}

function validQuantity(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_LINE_QUANTITY;
}

function messageFor(error: unknown) {
  if (error instanceof CartOperationError) return error.message;
  return "Shopify could not update the cart. Please try again.";
}

function expectedCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    const storeHost = process.env.SHOPIFY_STORE_DOMAIN
      ?.trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase();
    const siteHost = new URL(process.env.SITE_URL || "https://northwestern.golf")
      .hostname
      .toLowerCase();
    const allowedHosts = new Set([storeHost, siteHost].filter(Boolean));
    return url.protocol === "https:" && allowedHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

async function currentServerCart() {
  const cartId = await readCartId();
  if (!cartId) return null;
  return getCartById(cartId);
}

export async function getCartAction(): Promise<CartActionResult> {
  if (!isRetailCartEnabled()) return unavailable();

  try {
    const cart = await currentServerCart();
    if (!cart) {
      return { cart: null, message: "", ok: true };
    }

    return { cart: cart.safe, message: "", ok: true };
  } catch {
    return {
      cart: null,
      message: "Your saved cart could not be restored. Add an item to start a new cart.",
      ok: false,
    };
  }
}

export async function addCartLineAction(
  merchandiseId: string,
  quantity: number,
): Promise<CartActionResult> {
  if (!isRetailCartEnabled()) return unavailable();
  if (!validId(merchandiseId, VARIANT_ID_PREFIX) || !validQuantity(quantity)) {
    return { cart: null, message: "Choose a valid product option and quantity.", ok: false };
  }

  try {
    const cartId = await readCartId();
    let cart;

    if (cartId) {
      try {
        cart = await addCartLine(cartId, merchandiseId, quantity);
      } catch (error) {
        const existing = await getCartById(cartId).catch(() => null);
        if (existing) throw error;
        cart = await createCart(merchandiseId, quantity);
      }
    } else {
      cart = await createCart(merchandiseId, quantity);
    }

    await writeCartId(cart.id);
    return { cart: cart.safe, message: cart.warnings[0] || "Added to cart.", ok: true };
  } catch (error) {
    return { cart: null, message: messageFor(error), ok: false };
  }
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  if (!isRetailCartEnabled()) return unavailable();
  if (!validId(lineId, LINE_ID_PREFIX) || !validQuantity(quantity)) {
    return { cart: null, message: "Choose a valid cart quantity.", ok: false };
  }

  try {
    const cartId = await readCartId();
    if (!cartId) return { cart: null, message: "Your cart has expired.", ok: false };
    const cart = await updateCartLine(cartId, lineId, quantity);
    await writeCartId(cart.id);
    return { cart: cart.safe, message: cart.warnings[0] || "Cart updated.", ok: true };
  } catch (error) {
    return { cart: null, message: messageFor(error), ok: false };
  }
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  if (!isRetailCartEnabled()) return unavailable();
  if (!validId(lineId, LINE_ID_PREFIX)) {
    return { cart: null, message: "That cart item could not be removed.", ok: false };
  }

  try {
    const cartId = await readCartId();
    if (!cartId) return { cart: null, message: "Your cart has expired.", ok: false };
    const cart = await removeCartLine(cartId, lineId);
    await writeCartId(cart.id);
    return { cart: cart.safe, message: cart.warnings[0] || "Item removed.", ok: true };
  } catch (error) {
    return { cart: null, message: messageFor(error), ok: false };
  }
}

export async function getCheckoutUrlAction(): Promise<CheckoutActionResult> {
  if (!isRetailCartEnabled()) {
    return { message: "Retail checkout is not connected yet.", ok: false, url: null };
  }

  try {
    const cart = await currentServerCart();
    if (!cart || cart.safe.totalQuantity < 1) {
      return { message: "Your cart is empty.", ok: false, url: null };
    }

    if (!expectedCheckoutUrl(cart.safe.checkoutUrl)) {
      return {
        message: "Shopify returned an unexpected checkout destination. Checkout was stopped.",
        ok: false,
        url: null,
      };
    }

    return { message: "", ok: true, url: cart.safe.checkoutUrl };
  } catch {
    return {
      message: "Shopify checkout is temporarily unavailable. Please try again.",
      ok: false,
      url: null,
    };
  }
}
