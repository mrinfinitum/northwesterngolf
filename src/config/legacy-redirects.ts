/**
 * URLs from the earlier sites (WordPress/WooCommerce, then the Shopify theme) that
 * search engines and old links still point at. Shopify's own URL redirects only run on
 * the Shopify storefront, so they are mirrored here, pointing straight at the final page
 * (no redirect chains). Sources: Shopify admin > URL redirects, plus Wayback Machine crawls.
 */

// Every discontinued product line (Thunderbird, Talon SS, Brian Symonds wedges) is gone,
// so its old URLs, pages and the Past Models showcase all land on the current sets.
const SHOP = "/collections/all";
const THUNDERBIRD = SHOP;
const TALON = SHOP;
const WEDGES = SHOP;

/** Shopify pages for discontinued lines; redirected and kept out of the sitemap. */
export const retiredPageHandles = new Set(["past-models", "talon-ss", "thunderbird-full-set", "wedges"]);

/**
 * Old product slugs (WordPress /product/x, and Shopify redirect targets that never existed),
 * with the Shopify handle each one became. Any /products/x that no longer exists also
 * redirects to the shop, from the product page itself.
 */
const oldProductSlugs: Record<string, string> = {
  "mens-talon-ss-full-set": "men-s-talon-ss-full-set",
  "mens-thunderbird-driver": "men-s-thunderbird-driver",
  "mens-thunderbird-fairway": "men-s-thunderbird-fairway",
  "mens-thunderbird-full-set": "men-s-thunderbird-full-set",
  "mens-thunderbird-hybrid": "men-s-thunderbird-hybrid",
  "mens-thunderbird-irons": "men-s-thunderbird-irons-set",
  "mens-thunderbird-wedges": "men-s-thunderbird-wedge",
  "seniors-talon-ss-full-set": "senior-s-talon-ss-full-set",
  "seniors-thunderbird-driver": "senior-s-thunderbird-driver",
  "seniors-thunderbird-fairway": "senior-s-thunderbird-fairway",
  "seniors-thunderbird-full-set": "senior-s-thunderbird-full-set",
  "seniors-thunderbird-hybrid": "senior-s-thunderbird-hybrid",
  "seniors-thunderbird-irons": "senior-s-thunderbird-irons-set",
  "thunderbird-golf-bags": "thunderbird-golf-bag",
  "womens-talon-ss-full-set": "women-s-talon-ss-full-set",
  "womens-thunderbird-driver": "women-s-thunderbird-driver",
  "womens-thunderbird-fairway": "women-s-thunderbird-fairway",
  "womens-thunderbird-full-set": "women-s-thunderbird-full-set",
  "womens-thunderbird-hybrids": "women-s-thunderbird-hybrids",
  "womens-thunderbird-irons": "women-s-thunderbird-irons-set",
  // Shopify redirect targets that were never real product handles.
  "men-s-thunderbird-irons": "men-s-thunderbird-irons-set",
  "men-s-thunderbird-wedges": "men-s-thunderbird-wedge",
  "senior-s-thunderbird-irons": "senior-s-thunderbird-irons-set",
  "women-s-thunderbird-irons": "women-s-thunderbird-irons-set",
};

const pathRedirects: Record<string, string> = {
  // Brands, tags and WooCommerce shop categories.
  "/brain-symonds-wedges": WEDGES,
  "/brand/brian-symonds": WEDGES,
  "/brand/talon-ss": TALON,
  "/brand/thunderbird": THUNDERBIRD,
  "/contact": "/pages/contact",
  "/golf-bags": SHOP,
  "/mens-driver": SHOP,
  "/mens-fairway-woods": SHOP,
  "/mens-irons": SHOP,
  "/mens-thunderbird-full-set": THUNDERBIRD,
  "/our-story": "/pages/our-story",
  "/product-tag/brian-symonds": WEDGES,
  "/product-tag/drivers": SHOP,
  "/product-tag/fairways": SHOP,
  "/product-tag/golf-bags": SHOP,
  "/product-tag/hybrids": SHOP,
  "/product-tag/irons": SHOP,
  "/product-tag/men": SHOP,
  "/product-tag/senior": SHOP,
  "/product-tag/talon-ss": TALON,
  "/product-tag/thunderbird": THUNDERBIRD,
  "/product-tag/wedges": WEDGES,
  "/product-tag/women": SHOP,
  "/product/brian-symonds-classic-design-wedges": WEDGES,
  "/products/brian-symonds-classic-design-wedges": WEDGES,
  "/seniors-driver": SHOP,
  "/seniors-fairway-woods": SHOP,
  "/seniors-irons": SHOP,
  "/seniors-thunderbird-full-set": THUNDERBIRD,
  "/shop": SHOP,
  "/shop/drivers": SHOP,
  "/shop/fairways": SHOP,
  "/shop/golf-bags": SHOP,
  "/shop/hybrids": SHOP,
  "/shop/irons": SHOP,
  "/shop/mens-collection": SHOP,
  "/shop/seniors-collection": SHOP,
  "/shop/symonds-wedges": WEDGES,
  "/shop/talon-ss-full-set": TALON,
  "/shop/thunderbird-full-set": THUNDERBIRD,
  "/shop/wedges": WEDGES,
  "/shop/womens-collection": SHOP,
  "/talon-ss": TALON,
  "/thunderbird": THUNDERBIRD,
  "/thunderbird-full-set": THUNDERBIRD,
  "/thunderbird-wedges": WEDGES,
  "/wedges": WEDGES,
  "/womens-driver": SHOP,
  "/womens-fairway-woods": SHOP,
  "/womens-irons": SHOP,
  "/womens-thunderbird-full-set": THUNDERBIRD,
};

for (const handle of retiredPageHandles) pathRedirects[`/pages/${handle}`] = SHOP;

for (const [slug, handle] of Object.entries(oldProductSlugs)) {
  for (const path of [`/product/${slug}`, `/products/${slug}`, `/products/${handle}`]) pathRedirects[path] ??= SHOP;
}

/** For next.config `redirects()`; trailing slashes are already normalised by Next. */
export const legacyRedirects = Object.entries(pathRedirects).map(([source, destination]) => ({
  destination,
  permanent: true,
  source,
}));

/**
 * Old Shopify collections that are now empty. Instead of an empty, noindexed page they
 * send visitors (and link equity) to the current sets.
 */
export const emptyCollectionRedirects: Record<string, string> = {
  "symonds-wedges": WEDGES,
  "talon-ss": TALON,
  "talon-ss-full-set": TALON,
  thunderbird: THUNDERBIRD,
  "thunderbird-full-set": THUNDERBIRD,
  wedges: WEDGES,
};

/** Collection handles the old sites linked to that never existed on (or were deleted from) Shopify. */
export const missingLegacyCollections = new Set(["men-s-collection", "seniors-collection", "womens-collection"]);

export function emptyCollectionDestination(handle: string) {
  return emptyCollectionRedirects[handle] ?? SHOP;
}
