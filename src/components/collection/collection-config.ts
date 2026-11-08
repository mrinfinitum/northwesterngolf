/**
 * Theme/Admin-only collection settings that the tokenless Storefront API does
 * not expose. Product order for the default view always comes from Shopify
 * (`COLLECTION_DEFAULT`); this config only supplies the "Sort by" label the
 * live theme shows for each collection's Admin default sort order, captured
 * from northwestern.golf. Unknown collections fall back to the store-wide
 * convention (price, high to low).
 */
export const collectionDefaultSort: Record<string, string> = {
  "mens-collection": "manual",
};

export const FALLBACK_COLLECTION_SORT = "price-descending";

/**
 * `/collections/all` is a theme virtual collection titled "Products". It opens
 * cheapest first (Junior 5-8, Junior 9-12, then Men's).
 */
export const allProductsCollection = {
  defaultSort: "price-ascending",
  title: "Products",
} as const;
