"use client";

import { useState, useTransition } from "react";
import { getCheckoutUrlAction } from "@/app/cart/actions";

export function CheckoutButton({ disabled = false }: { disabled?: boolean }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function checkout() {
    startTransition(async () => {
      const result = await getCheckoutUrlAction();
      if (!result.ok || !result.url) {
        setError(result.message);
        return;
      }
      window.location.assign(result.url);
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
