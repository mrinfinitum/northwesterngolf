import { PRODUCT_FRAGMENT } from "../fragments/product";

export const COLLECTION_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Collection(
    $handle: String!
    $first: Int!
    $after: String
    $filters: [ProductFilter!]
    $reverse: Boolean!
    $sortKey: ProductCollectionSortKeys!
  ) {
    collection(handle: $handle) {
      description
      descriptionHtml
      handle
      id
      image { ...image }
      products(
        first: $first
        after: $after
        filters: $filters
        reverse: $reverse
        sortKey: $sortKey
      ) {
        nodes { ...product }
        pageInfo { endCursor hasNextPage }
      }
      seo { ...seo }
      title
      updatedAt
    }
  }
`;
