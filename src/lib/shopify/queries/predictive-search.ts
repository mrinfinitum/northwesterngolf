export const PREDICTIVE_SEARCH_QUERY = /* GraphQL */ `
  query PredictiveSearch($query: String!, $limit: Int!) {
    predictiveSearch(
      query: $query
      limit: $limit
      limitScope: EACH
      types: [PRODUCT, QUERY, COLLECTION]
      unavailableProducts: LAST
    ) {
      products {
        id
        handle
        title
        featuredImage { altText height url width }
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { maxVariantPrice { amount currencyCode } }
      }
      queries { text }
      collections { id handle title }
    }
  }
`;
