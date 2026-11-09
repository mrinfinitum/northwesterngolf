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
 * `/collections/all` is a theme virtual collection: the live theme titles it
 * "Products" and forces `sort_by=price-descending` with an inline script.
 */
export const allProductsCollection = {
  defaultSort: "price-descending",
  title: "Products",
} as const;
