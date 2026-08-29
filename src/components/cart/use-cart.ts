"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/cart/actions";
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
      setCart(result.cart);
      publishCartUpdate(result.cart, false, result.message);
    });
  }, []);

  return { cart, error, notice, pending, removeLine, setCart, setError, updateQuantity };
}
