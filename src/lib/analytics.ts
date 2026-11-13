/**
 * Google Analytics 4 ecommerce events. The Google tag (GT-5R3QNQJ8) only loads in
 * production, so every call is a no-op on dev, preview and local builds.
 * Purchases (and checkout steps) are reported by Shopify checkout through the same tag.
 */

/** The Shopify-managed Google tag; it forwards to GA4 G-T04EQ37VVZ and the Shopify channel. */
export const GOOGLE_TAG_ID = "GT-5R3QNQJ8";

export type AnalyticsItem = {
  discount?: number;
  index?: number;
  item_category?: string;
  item_id: string;
  item_list_id?: string;
  item_list_name?: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export type EcommerceEvent =
  | "add_to_cart"
  | "begin_checkout"
  | "remove_from_cart"
  | "select_item"
  | "view_cart"
  | "view_item"
  | "view_item_list";

const BRAND = "Northwestern Golf";

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as unknown as { gtag?: unknown }).gtag;
  return typeof candidate === "function" ? (candidate as Gtag) : null;
}

/** Events only go out where the Google tag is rendered: production. */
const enabled = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/** Sends a GA4 event once the Google tag is ready. No-op outside production. */
export function trackEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || !enabled) return;
  // Page-load events can fire before Next's afterInteractive script defines gtag and
  // sends `config`; anything queued ahead of `config` has no destination and is dropped.
  // Wait (up to ~10s) for gtag, so the event lands after `config`.
  let tries = 0;
  const attempt = () => {
    const send = gtag();
    if (send) send("event", name, params);
    else if (++tries < 40) window.setTimeout(attempt, 250);
  };
  attempt();
}

export function trackEcommerce(
  name: EcommerceEvent,
  currency: string,
  items: AnalyticsItem[],
  extra: Record<string, unknown> = {},
) {
  if (!items.length) return;
  const value = items.reduce((total, item) => total + item.price * item.quantity, 0);
  trackEvent(name, {
    ...extra,
    currency,
    items: items.map((item) => ({ item_brand: BRAND, ...item })),
    value: Number(value.toFixed(2)),
  });
}

/** Junior sets vs the men's set, for GA's item category reports. */
export function itemCategory(title: string) {
  return /junior/i.test(title) ? "Junior Sets" : /women/i.test(title) ? "Women's Sets" : "Men's Sets";
}

type CartLineLike = {
  cost: { amountPerQuantity: { amount: string } };
  merchandise: { id: string; product: { id: string; title: string }; title: string };
  quantity: number;
};

/** A cart line as a GA item (quantity can be overridden for partial removals). */
export function cartLineItem(line: CartLineLike, quantity = line.quantity): AnalyticsItem {
  return {
    item_category: itemCategory(line.merchandise.product.title),
    item_id: itemId(line.merchandise.product.id, line.merchandise.id),
    item_name: line.merchandise.product.title,
    item_variant: line.merchandise.title,
    price: Number(line.cost.amountPerQuantity.amount),
    quantity,
  };
}

type CartLike = { cost: { subtotalAmount: { currencyCode: string } }; lines: CartLineLike[] };

/** view_cart / begin_checkout for a whole cart. */
export function trackCart(name: "begin_checkout" | "view_cart", cart: CartLike | null | undefined) {
  if (!cart?.lines.length) return;
  trackEcommerce(name, cart.cost.subtotalAmount.currencyCode, cart.lines.map((line) => cartLineItem(line)));
}

type ListProductLike = {
  compareAtPriceRange?: { maxVariantPrice: { amount: string } };
  handle: string;
  id: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  title: string;
  variants?: { id: string }[];
};

/** Products in a list (collection grid, set cards) as GA items, keyed by handle for select_item. */
export function listItems(products: ListProductLike[]) {
  return products.map((product, index) => {
    const price = Number(product.priceRange.minVariantPrice.amount);
    const compareAt = Number(product.compareAtPriceRange?.maxVariantPrice.amount ?? 0);
    const variantId = product.variants?.[0]?.id;
    return {
      currency: product.priceRange.minVariantPrice.currencyCode,
      handle: product.handle,
      item: {
        ...(compareAt > price ? { discount: Number((compareAt - price).toFixed(2)) } : {}),
        index,
        item_category: itemCategory(product.title),
        item_id: variantId ? itemId(product.id, variantId) : `shopify_US_${numericId(product.id)}`,
        item_name: product.title,
        price,
        quantity: 1,
      } satisfies AnalyticsItem,
    };
  });
}

export type ListItems = ReturnType<typeof listItems>;

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
