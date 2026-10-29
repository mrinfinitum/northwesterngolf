"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Cart } from "@/lib/shopify/types";
import { CartItems } from "./CartItems";
import { CartSummary } from "./CartSummary";
import { useCart } from "./use-cart";

export function CartPageClient({ enabled, initialCart }: { enabled: boolean; initialCart: Cart | null }) {
  const { cart, error, notice, pending, removeLine, updateQuantity } = useCart(initialCart);

  // With the commerce gate closed nothing can be added, so the cart is empty.
  if (!enabled || !cart?.lines.length) {
    return (
      <>
        <EmptyState actionHref="/collections/all" actionLabel="Continue shopping" count={0} icon="cart" title="Your cart is empty" />
        {error ? <p aria-live="polite" className="cart-error">{error}</p> : null}
        {notice ? <p aria-live="polite" className="cart-success">{notice}</p> : null}
      </>
    );
  }

  return (
    <div className="cart-page page-shell page-shell--wide">
      <div className="cart-page__grid">
        <section aria-labelledby="cart-heading">
          <div className="cart-page__header">
            <h1 id="cart-heading">Your cart</h1>
            <span>{cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}</span>
          </div>
          <CartItems cart={cart} pending={pending} removeLine={removeLine} updateQuantity={updateQuantity} />
          {error ? <p aria-live="polite" className="cart-error">{error}</p> : null}
          {notice ? <p aria-live="polite" className="cart-success">{notice}</p> : null}
          <Link className="cart-continue-link" href="/collections/all">Continue shopping</Link>
        </section>
        <aside aria-label="Order summary" className="cart-page__summary">
          <h2>Order summary</h2>
          <CartSummary cart={cart} pending={pending} />
        </aside>
      </div>
    </div>
  );
}
