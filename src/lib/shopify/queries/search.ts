import { PRODUCT_FRAGMENT } from "../fragments/product";

export const SEARCH_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Search($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT, PAGE, ARTICLE]) {
      nodes {
        __typename
        ... on Product { ...product }
        ... on Page {
          body
          bodySummary
          handle
          id
          seo { ...seo }
          title
          updatedAt
        }
        ... on Article {
          blog { handle }
          excerpt
          handle
          id
          title
        }
      }
    }
  }
`;
