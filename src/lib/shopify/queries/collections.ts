import { IMAGE_FRAGMENT } from "../fragments/image";
import { SEO_FRAGMENT } from "../fragments/seo";

export const COLLECTIONS_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        description
        handle
        id
        image { ...image }
        products(first: 1) { nodes { id } }
        seo { ...seo }
        title
        updatedAt
      }
    }
  }
`;
