"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCartAction } from "@/app/cart/actions";
import { CartItems } from "@/components/cart/CartItems";
import { CartSummary } from "@/components/cart/CartSummary";
import {
  CART_UPDATED_EVENT,
  type CartUpdatedDetail,
} from "@/components/cart/cart-events";
import { useCart } from "@/components/cart/use-cart";
import { BagIcon, CloseIcon } from "@/components/ui/icons";

export function CartButton({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const { cart, error, notice, pending, removeLine, setCart, setError, updateQuantity } = useCart(null);
  const itemCount = cart?.totalQuantity ?? 0;

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    getCartAction().then((result) => {
      if (!active) return;
      setCart(result.cart);
      if (!result.ok) setError(result.message);
    });
    return () => { active = false; };
  }, [enabled, setCart, setError]);

  useEffect(() => {
    const update = (event: Event) => {
      const detail = (event as CustomEvent<CartUpdatedDetail>).detail;
      if (detail.open) setOpen(true);
    };
    window.addEventListener(CART_UPDATED_EVENT, update);
    return () => window.removeEventListener(CART_UPDATED_EVENT, update);
  }, []);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) triggerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        aria-controls="cart-drawer"
        aria-expanded={open}
        aria-label={enabled ? `Cart with ${itemCount} items` : "Cart setup pending"}
        className="icon-button cart-trigger"
        disabled={!enabled}
        onClick={() => setOpen(true)}
        title={enabled ? "Open cart" : "Retail cart is configured but not connected yet"}
        ref={triggerRef}
        type="button"
      >
        <BagIcon />
        {itemCount > 0 ? <span aria-hidden="true">{itemCount}</span> : null}
      </button>
      {open ? (
        <div className="drawer-layer">
          <button aria-label="Close cart" className="drawer-layer__backdrop" onClick={() => setOpen(false)} type="button" />
          <aside aria-label="Shopping cart" aria-modal="true" className="cart-drawer" id="cart-drawer" ref={drawerRef} role="dialog">
            <header className="cart-drawer__header">
              <div>
                <p>Shopping cart</p>
                <span>{cart?.totalQuantity ?? 0} {cart?.totalQuantity === 1 ? "item" : "items"}</span>
              </div>
              <button aria-label="Close cart" className="icon-button" onClick={() => setOpen(false)} ref={closeRef} type="button"><CloseIcon /></button>
            </header>
            <div className="cart-drawer__body">
              {cart?.lines.length ? (
                <CartItems cart={cart} pending={pending} removeLine={removeLine} updateQuantity={updateQuantity} />
              ) : (
                <div className="cart-empty">
                  <h2>Your cart is empty</h2>
                  <p>Add a club or set to begin your retail order.</p>
                  <Link className="button button--primary" href="/collections/all" onClick={() => setOpen(false)}>Shop all</Link>
                </div>
              )}
              {error ? <p aria-live="polite" className="cart-error">{error}</p> : null}
              {notice ? <p aria-live="polite" className="cart-success">{notice}</p> : null}
            </div>
            {cart?.lines.length ? (
              <footer className="cart-drawer__footer">
                <CartSummary cart={cart} pending={pending} />
                <Link className="cart-view-link" href="/cart" onClick={() => setOpen(false)}>View full cart</Link>
                <Link className="cart-continue-link cart-continue-link--drawer" href="/collections/all" onClick={() => setOpen(false)}>Continue shopping</Link>
              </footer>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
