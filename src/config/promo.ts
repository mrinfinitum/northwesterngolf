/**
 * Launch promotions. Edit these values to change the copy site-wide.
 *
 * Pre-orders: a variant is a pre-order when Shopify still sells it
 * ("Continue selling when out of stock") but it has no stock. Once the 3PL
 * syncs inventory, in-stock variants switch back to "Add to cart" on their own.
 *
 * The 20% discount itself lives in Shopify (compare-at prices), which drives the
 * struck-through prices and "Save" badges. This file only sets the messaging.
 */

/** Shown next to every pre-order button, badge and cart line, and saved on the order line. */
export const PREORDER_SHIP_NOTE = "Ships by Dec 1";

/** Longer reassurance on the product page. */
export const PREORDER_DELIVERY_NOTE = "Every pre-order ships by December 1, in plenty of time for Christmas.";

export type PromoBar = {
  cta: { href: string; label: string };
  /** ISO date-time the event ends. Shows a countdown when set; the bar hides itself after it passes. */
  endsAt: string | null;
  label: string;
  offer: string;
  subline: string;
};

/** Bar above the header. Set to null to hide it. */
export const promoBar: PromoBar | null = {
  cta: { href: "/collections/all", label: "Shop sets" },
  endsAt: null,
  label: "Launch Event",
  offer: "20% off sitewide",
  subline: "Pre-orders ship by Dec 1 · Delivered before Christmas",
};
