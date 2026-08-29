import { SEO_FRAGMENT } from "../fragments/seo";

export const PAGE_QUERY = /* GraphQL */ `
  ${SEO_FRAGMENT}
  query Page($handle: String!) {
    page(handle: $handle) {
      body
      bodySummary
      handle
      id
      seo { ...seo }
      title
      updatedAt
    }
  }
`;
