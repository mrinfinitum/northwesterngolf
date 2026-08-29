import "server-only";

import { cache } from "react";
import { COLLECTION_QUERY } from "./queries/collection";
import { COLLECTIONS_QUERY } from "./queries/collections";
import { MENU_QUERY } from "./queries/menu";
import { PAGE_QUERY } from "./queries/page";
import { POLICIES_QUERY } from "./queries/policies";
import { PRODUCT_QUERY } from "./queries/product";
import { PRODUCTS_QUERY } from "./queries/products";
import { SEARCH_QUERY } from "./queries/search";
import type {
  Collection,
  Product,
  SearchResult,
  ShopifyGraphqlResponse,
  ShopifyImage,
  ShopifyMenu,
  ShopifyPage,
  ShopifyPolicy,
  ProductVariant,
} from "./types";

export * from "./types";

export const SHOPIFY_API_VERSION = "2026-07";
const DEFAULT_REVALIDATE_SECONDS = 900;

type Connection<T> = {
  nodes: T[];
  pageInfo?: { endCursor: string | null; hasNextPage: boolean };
};

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: Connection<ShopifyImage>;
  variants: Connection<ProductVariant>;
};

type RawCollection = Omit<Collection, "products"> & {
  products: Connection<RawProduct>;
};

type RawSearchNode =
  | (RawProduct & { __typename: "Product" })
  | (ShopifyPage & { __typename: "Page" })
  | {
      __typename: "Article";
      blog: { handle: string };
      excerpt: string | null;
      handle: string;
      id: string;
      title: string;
    };

type ShopifyFetchOptions = {
  cache?: RequestCache;
  query: string;
  tags?: string[];
  variables?: Record<string, unknown>;
};

function getStoreDomain() {
  const value = process.env.SHOPIFY_STORE_DOMAIN?.trim();

  if (!value) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN is required. Copy .env.example to .env.local and use the permanent myshopify.com domain.",
    );
  }

  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export async function shopifyFetch<T>({
  cache: cacheMode,
  query,
  tags = [],
  variables = {},
}: ShopifyFetchOptions): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (token) {
    headers["X-Shopify-Storefront-Access-Token"] = token;
  }

  const response = await fetch(
    `https://${getStoreDomain()}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      body: JSON.stringify({ query, variables }),
      cache: cacheMode,
      headers,
      method: "POST",
      ...(cacheMode === "no-store"
        ? {}
        : {
            next: {
              revalidate: DEFAULT_REVALIDATE_SECONDS,
              tags: ["shopify", ...tags],
            },
          }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront API request failed (${response.status} ${response.statusText}).`,
    );
  }

  const payload = (await response.json()) as ShopifyGraphqlResponse<T>;

  if (payload.errors?.length) {
    throw new Error(
      `Shopify Storefront API error: ${payload.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
  }

  if (!payload.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return payload.data;
}

function normalizeProduct(product: RawProduct): Product {
  return {
    ...product,
    images: product.images.nodes,
    variants: product.variants.nodes,
  };
}

function normalizeCollection(collection: RawCollection): Collection {
  return {
    ...collection,
    products: collection.products.nodes.map(normalizeProduct),
  };
}

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  const data = await shopifyFetch<{ product: RawProduct | null }>({
    query: PRODUCT_QUERY,
    tags: [`product:${handle}`],
    variables: { handle },
  });

  return data.product ? normalizeProduct(data.product) : null;
});

export async function getProducts({
  first = 24,
  query,
  sortKey = "BEST_SELLING",
}: {
  first?: number;
  query?: string;
  sortKey?: "BEST_SELLING" | "CREATED_AT" | "PRICE" | "PRODUCT_TYPE" | "TITLE";
} = {}): Promise<Product[]> {
  const data = await shopifyFetch<{ products: Connection<RawProduct> }>({
    query: PRODUCTS_QUERY,
    tags: ["products"],
    variables: { first, query: query || null, sortKey },
  });

  return data.products.nodes.map(normalizeProduct);
}

export const getCollection = cache(
  async (
    handle: string,
    {
      filters = [],
      first = 48,
      reverse = false,
      sortKey = "COLLECTION_DEFAULT",
    }: {
      filters?: Array<{
        available?: boolean;
        price?: { max?: number; min?: number };
      }>;
      first?: number;
      reverse?: boolean;
      sortKey?:
        | "BEST_SELLING"
        | "COLLECTION_DEFAULT"
        | "CREATED"
        | "MANUAL"
        | "PRICE"
        | "TITLE";
    } = {},
  ): Promise<Collection | null> => {
    const data = await shopifyFetch<{ collection: RawCollection | null }>({
      query: COLLECTION_QUERY,
      tags: [`collection:${handle}`],
      variables: { after: null, filters, first, handle, reverse, sortKey },
    });

    return data.collection ? normalizeCollection(data.collection) : null;
  },
);

export async function getCollections(first = 100) {
  const data = await shopifyFetch<{
    collections: Connection<Omit<Collection, "products">>;
  }>({
    query: COLLECTIONS_QUERY,
    tags: ["collections"],
    variables: { first },
  });

  return data.collections.nodes;
}

export async function getMenu(handle: string): Promise<ShopifyMenu | null> {
  try {
    const data = await shopifyFetch<{ menu: ShopifyMenu | null }>({
      query: MENU_QUERY,
      tags: [`menu:${handle}`],
      variables: { handle },
    });

    return data.menu;
  } catch {
    // Public tokenless storefront access may not include menus. The audited,
    // isolated navigation fallback remains authoritative until Admin export.
    return null;
  }
}

export const getPage = cache(async (handle: string): Promise<ShopifyPage | null> => {
  const data = await shopifyFetch<{ page: ShopifyPage | null }>({
    query: PAGE_QUERY,
    tags: [`page:${handle}`],
    variables: { handle },
  });

  return data.page;
});

export const getPolicy = cache(async (handle: string): Promise<ShopifyPolicy | null> => {
  const data = await shopifyFetch<{
    shop: {
      privacyPolicy: ShopifyPolicy | null;
      refundPolicy: ShopifyPolicy | null;
      shippingPolicy: ShopifyPolicy | null;
      termsOfService: ShopifyPolicy | null;
    };
  }>({
    query: POLICIES_QUERY,
    tags: ["policies"],
  });
  const policies = Object.values(data.shop).filter(
    (policy): policy is ShopifyPolicy => Boolean(policy),
  );
  return policies.find((policy) => policy.handle === handle) ?? null;
});

export async function searchStore(query: string, first = 24): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const data = await shopifyFetch<{ search: Connection<RawSearchNode> }>({
    query: SEARCH_QUERY,
    tags: [`search:${query.toLowerCase()}`],
    variables: { first, query },
  });

  return data.search.nodes.map((node) => {
    if (node.__typename === "Product") {
      return { ...normalizeProduct(node), resultType: "product" as const };
    }

    if (node.__typename === "Page") {
      return { ...node, resultType: "page" as const };
    }

    return { ...node, resultType: "article" as const };
  });
}

export function getSiteUrl() {
  return (process.env.SITE_URL || "https://northwestern.golf").replace(/\/$/, "");
}
