/**
 * Google Analytics 4 ecommerce events. The Google tag (GT-5R3QNQJ8) only loads in
 * production, so every call is a no-op on dev, preview and local builds.
 * Purchases are reported by Shopify checkout through the same tag.
 */

/** The Shopify-managed Google tag; it forwards to GA4 G-T04EQ37VVZ and the Shopify channel. */
export const GOOGLE_TAG_ID = "GT-5R3QNQJ8";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as unknown as { gtag?: unknown }).gtag;
  return typeof candidate === "function" ? (candidate as Gtag) : null;
}

/**
 * Queue a gtag command even if the tag script hasn't defined `gtag` yet (effects can run
 * before Next's afterInteractive scripts). The Google tag replays `dataLayer` when it loads;
 * it only accepts the `arguments` object, not a plain array.
 */
const queue: Gtag = function () {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params -- gtag requires the Arguments object
  w.dataLayer.push(arguments);
};

/** Events only go out where the Google tag is rendered: production. */
const enabled = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export function trackEcommerce(
  name: "add_to_cart" | "begin_checkout" | "view_item",
  currency: string,
  items: AnalyticsItem[],
) {
  if (typeof window === "undefined" || !enabled || !items.length) return;
  const send = gtag() ?? queue;
  const value = items.reduce((total, item) => total + item.price * item.quantity, 0);
  send("event", name, { currency, items, value: Number(value.toFixed(2)) });
}

const numericId = (gid: string) => gid.split("/").pop() ?? gid;

/** Item ID in the format Shopify's Google channel and Merchant Center use, so GA joins views, carts and purchases. */
export function itemId(productGid: string, variantGid: string) {
  return `shopify_US_${numericId(productGid)}_${numericId(variantGid)}`;
}

/**
 * Lets the Google tag add its cross-domain `_gl` parameter to a URL we navigate to
 * from script (the tag only decorates real link clicks). Returns the URL unchanged
 * when the tag is not loaded or the domain is not configured for linking.
 */
export function decorateForCrossDomain(url: string) {
  if (!gtag()) return url;
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  document.body.append(link);
  link.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  const decorated = link.href;
  link.remove();
  return decorated;
}
