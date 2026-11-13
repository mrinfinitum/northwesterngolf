import type { ReactNode } from "react";

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
const SHIELD = icon(
  <>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

const CARD = icon(
  <>
    <rect height="14" rx="2" width="18" x="3" y="5" />
    <path d="M3 10h18M7 15h4" />
  </>,
);

/** Reassurance under the checkout button: heritage, Shop Pay installments, returns and warranty.
 * Pre-order timing is already on each cart line, so it isn't repeated here. */
const ITEMS = [
  { body: "Northwestern has been part of the game for nearly 100 years.", icon: AWARD, title: "Golf Since 1929" },
  { body: "4 interest-free payments or monthly plans with Shop Pay at checkout.", icon: CARD, title: "Pay Over Time" },
  { body: "Not the right fit? Send it back within 30 days. Every set is covered for a year.", icon: SHIELD, title: "30-Day Returns & 1-Year Warranty" },
];

export function CartAssurance() {
  return (
    <ul className="cart-assurance">
      {ITEMS.map((item) => (
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
