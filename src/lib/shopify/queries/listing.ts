import { PRODUCT_FRAGMENT } from "../fragments/product";

/**
 * Listing queries back the collection, "all products" and search result
 * pages. Filtering and sorting run server-side through the Storefront API;
 * `filters`/`productFilters` describe the facets Shopify exposes for the
 * current result set (availability, price range, ...).
 */
const FILTER_FIELDS = /* GraphQL */ `
  id
  label
  type
  values { id label count input }
`;

export const COLLECTION_LISTING_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query CollectionListing(
    $handle: String!
    $first: Int!
    $filters: [ProductFilter!]
    $reverse: Boolean!
    $sortKey: ProductCollectionSortKeys!
  ) {
    collection(handle: $handle) {
      description
      handle
      id
      seo { ...seo }
      title
      products(first: $first, filters: $filters, reverse: $reverse, sortKey: $sortKey) {
        filters { ${FILTER_FIELDS} }
        nodes { ...product }
      }
    }
  }
`;

export const PRODUCTS_LISTING_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductsListing($first: Int!, $query: String, $reverse: Boolean!, $sortKey: ProductSortKeys!) {
    products(first: $first, query: $query, reverse: $reverse, sortKey: $sortKey) {
      nodes { ...product }
    }
  }
`;

export const PRODUCTS_PRICE_CEILING_QUERY = /* GraphQL */ `
  query ProductsPriceCeiling {
    products(first: 1, sortKey: PRICE, reverse: true) {
      nodes { priceRange { maxVariantPrice { amount } } }
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query SearchProducts(
    $query: String!
    $first: Int!
    $productFilters: [ProductFilter!]
    $reverse: Boolean!
    $sortKey: SearchSortKeys!
  ) {
    search(
      query: $query
      first: $first
      types: [PRODUCT]
      productFilters: $productFilters
      reverse: $reverse
      sortKey: $sortKey
    ) {
      productFilters { ${FILTER_FIELDS} }
      totalCount
      nodes { ... on Product { ...product } }
    }
  }
`;

export const SEARCH_CONTENT_QUERY = /* GraphQL */ `
  query SearchContent($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PAGE, ARTICLE]) {
      nodes {
        __typename
        ... on Page { handle id title }
        ... on Article { blog { handle } handle id title }
      }
    }
  }
`;
