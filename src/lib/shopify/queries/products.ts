import { PRODUCT_FRAGMENT } from "../fragments/product";

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey) {
      nodes { ...product }
      pageInfo { endCursor hasNextPage }
    }
  }
`;
