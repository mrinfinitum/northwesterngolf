import "server-only";

import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
} from "./mutations/cart";
import { CART_QUERY } from "./queries/cart";
import { shopifyFetch } from "./index";
import type { Cart, CartLine, Money } from "./types";

type RawCart = Omit<Cart, "lines"> & { id: string; lines: { nodes: CartLine[] } };

type CartPayload = {
  cart: RawCart | null;
  userErrors: Array<{ field?: string[]; message: string }>;
  warnings: Array<{ code: string; message: string; target: string }>;
};

export type ServerCart = {
  id: string;
  safe: Cart;
  warnings: string[];
};

export class CartOperationError extends Error {}

function normalizeCart(cart: RawCart): ServerCart {
  const { id, lines, ...safeFields } = cart;

  return {
    id,
    safe: {
      ...safeFields,
      lines: lines.nodes,
    },
    warnings: [],
  };
}

function unwrapPayload(payload: CartPayload): ServerCart {
  if (payload.userErrors.length) {
    throw new CartOperationError(payload.userErrors[0].message);
  }

  if (!payload.cart) {
    throw new CartOperationError("Shopify did not return a cart.");
  }

  return {
    ...normalizeCart(payload.cart),
    warnings: payload.warnings.map((warning) => warning.message),
  };
}

export async function getCartById(id: string): Promise<ServerCart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    cache: "no-store",
    query: CART_QUERY,
    variables: { id },
  });

  return data.cart ? normalizeCart(data.cart) : null;
}

export async function createCart(
  merchandiseId: string,
  quantity: number,
): Promise<ServerCart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>({
    cache: "no-store",
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: [{ merchandiseId, quantity }],
      },
    },
  });

  return unwrapPayload(data.cartCreate);
}

export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<ServerCart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>({
    cache: "no-store",
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
  });

  return unwrapPayload(data.cartLinesAdd);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ServerCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>({
    cache: "no-store",
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  return unwrapPayload(data.cartLinesUpdate);
}

export async function removeCartLine(
  cartId: string,
  lineId: string,
): Promise<ServerCart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>({
    cache: "no-store",
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds: [lineId] },
  });

  return unwrapPayload(data.cartLinesRemove);
}

export function emptyCartCost(currencyCode = "USD"): Cart["cost"] {
  const zero: Money = { amount: "0", currencyCode };
  return { subtotalAmount: zero, totalAmount: zero, totalTaxAmount: null };
}
