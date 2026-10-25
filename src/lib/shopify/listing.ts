import "server-only";

import { cache } from "react";
import { shopifyFetch } from "./index";
import {
  COLLECTION_LISTING_QUERY,
  PRODUCTS_LISTING_QUERY,
  PRODUCTS_PRICE_CEILING_QUERY,
  SEARCH_CONTENT_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from "./queries/listing";
import type {
  ContentSearchResult,
  Product,
  ProductFilterGroup,
  ProductFilterInput,
  ProductListing,
  ProductVariant,
  Seo,
  ShopifyImage,
} from "./types";

/** Listing pages render every match on one page (the store has < 30 products). */
const LISTING_PAGE_SIZE = 100;

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: { nodes: ShopifyImage[] };
  variants: { nodes: ProductVariant[] };
};

const normalizeProduct = (product: RawProduct): Product => ({
  ...product,
  images: product.images.nodes,
  variants: product.variants.nodes,
});

export type CollectionSortKey = "BEST_SELLING" | "COLLECTION_DEFAULT" | "CREATED" | "MANUAL" | "PRICE" | "RELEVANCE" | "TITLE";
export type ProductSortKey = "BEST_SELLING" | "CREATED_AT" | "PRICE" | "RELEVANCE" | "TITLE";
export type SearchSortKey = "PRICE" | "RELEVANCE";

type SortInput<K> = { filters: ProductFilterInput[]; reverse: boolean; sortKey: K };

export type CollectionListing = ProductListing & {
  description: string;
  handle: string;
  seo: Seo;
  title: string;
};

export function getCollectionListing(handle: string, input: SortInput<CollectionSortKey>) {
  // `cache` compares arguments by identity, so key the request by value.
  return fetchCollectionListing(handle, JSON.stringify(input));
}

const fetchCollectionListing = cache(
  async (handle: string, key: string): Promise<CollectionListing | null> => {
    const { filters, reverse, sortKey } = JSON.parse(key) as SortInput<CollectionSortKey>;
    const data = await shopifyFetch<{
      collection: (Omit<CollectionListing, "filters" | "products" | "totalCount"> & {
        products: { filters: ProductFilterGroup[]; nodes: RawProduct[] };
      }) | null;
    }>({
      query: COLLECTION_LISTING_QUERY,
      tags: [`collection:${handle}`],
      variables: { filters, first: LISTING_PAGE_SIZE, handle, reverse, sortKey },
    });
    if (!data.collection) return null;
    const { products, ...collection } = data.collection;
    const items = products.nodes.map(normalizeProduct);
    return { ...collection, filters: products.filters, products: items, totalCount: items.length };
  },
);

/**
 * The theme's virtual `/collections/all` has no Collection object in the
 * Storefront API, so it is backed by the `products` connection. Facets are
 * expressed through the product search syntax and the price facet ceiling is
 * read from the most expensive product, mirroring what Shopify reports for
 * real collections.
 */
export async function getAllProductsListing({ filters, reverse, sortKey }: SortInput<ProductSortKey>): Promise<ProductListing> {
  const terms = filters.flatMap((filter) => [
    ...(filter.available ? ["available_for_sale:true"] : []),
    ...(filter.price?.min !== undefined ? [`variants.price:>=${filter.price.min}`] : []),
    ...(filter.price?.max !== undefined ? [`variants.price:<=${filter.price.max}`] : []),
  ]);
  const [listing, ceiling] = await Promise.all([
    shopifyFetch<{ products: { nodes: RawProduct[] } }>({
      query: PRODUCTS_LISTING_QUERY,
      tags: ["products"],
      variables: { first: LISTING_PAGE_SIZE, query: terms.join(" AND ") || null, reverse, sortKey },
    }),
    shopifyFetch<{ products: { nodes: Array<{ priceRange: { maxVariantPrice: { amount: string } } }> } }>({
      query: PRODUCTS_PRICE_CEILING_QUERY,
      tags: ["products"],
    }),
  ]);
  const products = listing.products.nodes.map(normalizeProduct);
  const max = Number(ceiling.products.nodes[0]?.priceRange.maxVariantPrice.amount ?? 0);
  return {
    filters: [
      { id: "filter.v.availability", label: "Availability", type: "LIST", values: [] },
      {
        id: "filter.v.price",
        label: "Price",
        type: "PRICE_RANGE",
        values: [{ count: 0, id: "filter.v.price", input: JSON.stringify({ price: { max, min: 0 } }), label: "Price" }],
      },
    ],
    products,
    totalCount: products.length,
  };
}

export async function searchProducts(query: string, { filters, reverse, sortKey }: SortInput<SearchSortKey>): Promise<ProductListing> {
  const data = await shopifyFetch<{
    search: { nodes: RawProduct[]; productFilters: ProductFilterGroup[]; totalCount: number };
  }>({
    query: SEARCH_PRODUCTS_QUERY,
    tags: [`search:${query.toLowerCase()}`],
    variables: { first: LISTING_PAGE_SIZE, productFilters: filters, query, reverse, sortKey },
  });
  return {
    filters: data.search.productFilters,
    products: data.search.nodes.map(normalizeProduct),
    totalCount: data.search.totalCount,
  };
}

export async function searchContent(query: string): Promise<ContentSearchResult[]> {
  type Node =
    | { __typename: "Page"; handle: string; id: string; title: string }
    | { __typename: "Article"; blog: { handle: string }; handle: string; id: string; title: string };
  const data = await shopifyFetch<{ search: { nodes: Node[] } }>({
    query: SEARCH_CONTENT_QUERY,
    tags: [`search:${query.toLowerCase()}`],
    variables: { first: 24, query },
  });
  return data.search.nodes.map(({ __typename, ...node }) =>
    __typename === "Page"
      ? { ...(node as Omit<Extract<Node, { __typename: "Page" }>, "__typename">), resultType: "page" as const }
      : { ...(node as Omit<Extract<Node, { __typename: "Article" }>, "__typename">), resultType: "article" as const },
  );
}
