/**
 * Retail cart code is prepared but remains server-gated until the store owner
 * explicitly enables it after Shopify/vendor verification. Wholesale,
 * customer-aware pricing, GOVX, and discount assumptions remain prohibited.
 *
 * SHOPIFY_CART_ENABLED=true activates only the anonymous retail Cart API lane.
 * It does not authorize wholesale/customer-aware commerce.
 */
export const COMMERCE_GATE = {
  cart: "PREPARED_DISABLED_BY_DEFAULT",
  checkout: "SHOPIFY_HOSTED_PREPARED_DISABLED_BY_DEFAULT",
  customerAccounts: "DEFERRED",
  govx: "DEFERRED",
  wholesaleGorilla: "BLOCKED_PENDING_VENDOR_ADMIN_VERIFICATION",
} as const;

export function isRetailCartEnabled() {
  return (
    process.env.SHOPIFY_CART_ENABLED === "true" &&
    Boolean(process.env.SHOPIFY_STORE_DOMAIN?.trim()) &&
    Boolean(process.env.SHOPIFY_CART_COOKIE_SECRET?.trim()) &&
    (process.env.SHOPIFY_CART_COOKIE_SECRET?.trim().length ?? 0) >= 32
  );
}
