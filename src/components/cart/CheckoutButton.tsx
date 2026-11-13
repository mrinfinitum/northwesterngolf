"use client";

import { useState, useTransition } from "react";
import { getCheckoutUrlAction } from "@/app/cart/actions";
import { decorateForCrossDomain, itemId, trackEcommerce } from "@/lib/analytics";
import type { Cart } from "@/lib/shopify/types";

export function CheckoutButton({ cart, disabled = false }: { cart: Cart; disabled?: boolean }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function checkout() {
    startTransition(async () => {
      const result = await getCheckoutUrlAction();
      if (!result.ok || !result.url) {
        setError(result.message);
        return;
      }
      trackEcommerce(
        "begin_checkout",
        cart.cost.subtotalAmount.currencyCode,
        cart.lines.map((line) => ({
          item_id: itemId(line.merchandise.product.id, line.merchandise.id),
          item_name: line.merchandise.product.title,
          item_variant: line.merchandise.title,
          price: Number(line.cost.amountPerQuantity.amount),
          quantity: line.quantity,
        })),
      );
      // Keep the GA session when the visitor moves to checkout.northwestern.golf.
      window.location.assign(decorateForCrossDomain(result.url));
    });
  }

  return (
    <>
      <button
        className="button button--primary checkout-button"
        disabled={disabled || pending}
        onClick={checkout}
        type="button"
      >
        {pending ? "Opening checkout…" : "Checkout"}
      </button>
      {error ? <p aria-live="polite" className="cart-error">{error}</p> : null}
    </>
  );
}
