import { PRODUCT_FRAGMENT } from "../fragments/product";

export const PRODUCT_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Product($handle: String!) {
    product(handle: $handle) { ...product }
  }
`;
