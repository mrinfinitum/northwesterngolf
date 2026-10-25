import { PRODUCT_FRAGMENT } from "../fragments/product";

export const PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductRecommendations($handle: String!, $intent: ProductRecommendationIntent) {
    productRecommendations(productHandle: $handle, intent: $intent) { ...product }
  }
`;
