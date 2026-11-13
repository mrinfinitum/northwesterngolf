import type { ReactNode } from "react";
import { PREORDER_DELIVERY_NOTE } from "@/config/promo";

const icon = (path: ReactNode) => (
  <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="22">
    {path}
  </svg>
);

const AWARD = icon(
  <>
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 13.9-1.5 7.1 5-3 5 3-1.5-7.1" />
  </>,
);
const TRUCK = icon(
  <>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17.5" cy="18" r="1.8" />
  </>,
);
const SHIELD = icon(
  <>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

/** Reassurance under the checkout button: heritage, pre-order timing, returns and warranty. */
export function CartAssurance({ preorder }: { preorder: boolean }) {
  const items = [
    { body: "Northwestern has been part of the game for nearly 100 years.", icon: AWARD, title: "Golf Since 1929" },
    ...(preorder ? [{ body: PREORDER_DELIVERY_NOTE, icon: TRUCK, title: "Ships by Dec 1" }] : []),
    { body: "30-day returns and a 1-year warranty on every set.", icon: SHIELD, title: "Secure Checkout" },
  ];

  return (
    <ul className="cart-assurance">
      {items.map((item) => (
        <li key={item.title}>
          <span className="cart-assurance__icon">{item.icon}</span>
          <span>
            <strong>{item.title}</strong>
            {item.body}
          </span>
        </li>
      ))}
    </ul>
  );
}
