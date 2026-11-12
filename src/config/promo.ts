/**
 * Launch promotions. Edit these strings to change the copy site-wide.
 *
 * Pre-orders: a variant is a pre-order when Shopify still sells it
 * ("Continue selling when out of stock") but it has no stock. Once the 3PL
 * syncs inventory, in-stock variants switch back to "Add to cart" on their own.
 */

/** Shown next to every pre-order button, badge and cart line, and saved on the order line. */
export const PREORDER_SHIP_NOTE = "Ships in 2–3 weeks";

/** Bar above the header. Set to null to hide it. Swap the text for Black Friday. */
export const announcement: { href?: string; text: string } | null = {
  href: "/collections/all",
  text: `Now taking pre-orders on the John Daly Signature Sets · ${PREORDER_SHIP_NOTE}`,
};
