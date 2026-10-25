/**
 * URL state for product listings (collections + search). Parameter names
 * mirror the live Shopify theme (`filter.v.availability`, `filter.v.price.gte`,
 * `filter.v.price.lte`, `sort_by`) so existing links and bookmarks keep working.
 */
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export type SortOption = { label: string; value: string };

export const COLLECTION_SORT_OPTIONS: SortOption[] = [
  { label: "Featured", value: "manual" },
  { label: "Most relevant", value: "most-relevant" },
  { label: "Best selling", value: "best-selling" },
  { label: "Alphabetically, A-Z", value: "title-ascending" },
  { label: "Alphabetically, Z-A", value: "title-descending" },
  { label: "Price, low to high", value: "price-ascending" },
  { label: "Price, high to low", value: "price-descending" },
  { label: "Date, old to new", value: "created-ascending" },
  { label: "Date, new to old", value: "created-descending" },
];

export const SEARCH_SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Price, low to high", value: "price-ascending" },
  { label: "Price, high to low", value: "price-descending" },
];

export const PARAM = {
  availability: "filter.v.availability",
  priceMax: "filter.v.price.lte",
  priceMin: "filter.v.price.gte",
  sort: "sort_by",
} as const;

export type ListingState = {
  inStock: boolean;
  priceMax?: number;
  priceMin?: number;
  /** Explicit `sort_by` from the URL, if valid for this listing. */
  sort?: string;
};

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function parsePrice(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

export function parseListingState(params: SearchParamsRecord, sortOptions: SortOption[]): ListingState {
  const sort = single(params[PARAM.sort]);
  return {
    inStock: single(params[PARAM.availability]) === "1",
    priceMax: parsePrice(single(params[PARAM.priceMax])),
    priceMin: parsePrice(single(params[PARAM.priceMin])),
    sort: sortOptions.some((option) => option.value === sort) ? sort : undefined,
  };
}

export function activeFilterInputs(state: ListingState) {
  return [
    ...(state.inStock ? [{ available: true }] : []),
    ...(state.priceMin !== undefined || state.priceMax !== undefined
      ? [{ price: { ...(state.priceMin !== undefined ? { min: state.priceMin } : {}), ...(state.priceMax !== undefined ? { max: state.priceMax } : {}) } }]
      : []),
  ];
}

/** Builds a listing URL; `base` keeps unrelated params such as `q`/`type`. */
export function listingHref(pathname: string, base: Record<string, string>, state: ListingState) {
  const params = new URLSearchParams(base);
  if (state.inStock) params.set(PARAM.availability, "1");
  if (state.priceMin !== undefined) params.set(PARAM.priceMin, String(state.priceMin));
  if (state.priceMax !== undefined) params.set(PARAM.priceMax, String(state.priceMax));
  if (state.sort) params.set(PARAM.sort, state.sort);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** Shopify reports the price facet ceiling as a decimal; the theme rounds up. */
export function priceCeiling(filters: Array<{ type: string; values: Array<{ input: string }> }>) {
  const price = filters.find((filter) => filter.type === "PRICE_RANGE");
  if (!price?.values[0]) return undefined;
  try {
    const parsed = JSON.parse(price.values[0].input) as { price?: { max?: number } };
    return Math.ceil(parsed.price?.max ?? 0);
  } catch {
    return undefined;
  }
}
