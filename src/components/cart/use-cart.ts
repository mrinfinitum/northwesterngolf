"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/cart/actions";
import { cartLineItem, trackEcommerce } from "@/lib/analytics";
import type { Cart } from "@/lib/shopify/types";
import {
  CART_UPDATED_EVENT,
  publishCartUpdate,
  type CartUpdatedDetail,
} from "./cart-events";

export function useCart(initialCart: Cart | null) {
  const [cart, setCart] = useState(initialCart);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();
  // Latest cart for analytics inside the stable callbacks below.
  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  /** add_to_cart / remove_from_cart for a quantity change on an existing line. */
  const trackLineChange = (lineId: string, quantity: number) => {
    const current = cartRef.current;
    const line = current?.lines.find((candidate) => candidate.id === lineId);
    if (!current || !line || quantity === line.quantity) return;
    const delta = quantity - line.quantity;
    trackEcommerce(delta > 0 ? "add_to_cart" : "remove_from_cart", current.cost.subtotalAmount.currencyCode, [
      cartLineItem(line, Math.abs(delta)),
    ]);
  };

  useEffect(() => {
    const update = (event: Event) => {
      const detail = (event as CustomEvent<CartUpdatedDetail>).detail;
      setCart(detail.cart);
      setError(detail.ok === false ? detail.message || "Cart update failed." : "");
      setNotice(detail.ok === false ? "" : detail.message || "");
    };
    window.addEventListener(CART_UPDATED_EVENT, update);
    return () => window.removeEventListener(CART_UPDATED_EVENT, update);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    startTransition(async () => {
      const result = await updateCartLineAction(lineId, quantity);
      if (!result.ok || !result.cart) {
        setError(result.message);
        setNotice("");
        return;
      }
      trackLineChange(lineId, quantity);
      setCart(result.cart);
      publishCartUpdate(result.cart, false, result.message);
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    startTransition(async () => {
      const result = await removeCartLineAction(lineId);
      if (!result.ok || !result.cart) {
        setError(result.message);
        setNotice("");
        return;
      }
      trackLineChange(lineId, 0);
      setCart(result.cart);
      publishCartUpdate(result.cart, false, result.message);
    });
  }, []);

  return { cart, error, notice, pending, removeLine, setCart, setError, updateQuantity };
}
