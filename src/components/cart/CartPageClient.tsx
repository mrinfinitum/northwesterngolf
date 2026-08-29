"use client";

import Link from "next/link";
import type { Cart } from "@/lib/shopify/types";
import { CartItems } from "./CartItems";
import { CartSummary } from "./CartSummary";
import { useCart } from "./use-cart";

export function CartPageClient({ enabled, initialCart }: { enabled: boolean; initialCart: Cart | null }) {
  const { cart, error, notice, pending, removeLine, updateQuantity } = useCart(initialCart);

  if (!enabled) {
    return (
      <div className="cart-empty cart-empty--page">
        <h1>Cart setup pending</h1>
        <p>The retail cart interface is ready but will remain disconnected until Shopify cart access and the commerce gate are approved.</p>
        <Link className="button button--primary" href="/collections/all">Continue shopping</Link>
      </div>
    );
  }

  if (!cart?.lines.length) {
    return (
      <div className="cart-empty cart-empty--page">
        <h1>Your cart is empty</h1>
        <p>Explore Northwestern Golf clubs, sets, and bags.</p>
        <Link className="button button--primary" href="/collections/all">Continue shopping</Link>
        {error ? <p aria-live="polite" className="cart-error">{error}</p> : null}
        {notice ? <p aria-live="polite" className="cart-success">{notice}</p> : null}
      </div>
    );
  }

  return (
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
  );
}
