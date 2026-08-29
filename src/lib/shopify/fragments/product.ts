import { IMAGE_FRAGMENT } from "./image";
import { SEO_FRAGMENT } from "./seo";

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
  fragment product on Product {
    availableForSale
    compareAtPriceRange {
      maxVariantPrice { amount currencyCode }
      minVariantPrice { amount currencyCode }
    }
    description
    descriptionHtml
    featuredImage { ...image }
    handle
    id
    images(first: 30) { nodes { ...image } }
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice { amount currencyCode }
      minVariantPrice { amount currencyCode }
    }
    productType
    seo { ...seo }
    tags
    title
    updatedAt
    variants(first: 100) {
      nodes {
        availableForSale
        compareAtPrice { amount currencyCode }
        currentlyNotInStock
        id
        image { ...image }
        price { amount currencyCode }
        selectedOptions { name value }
        sku
        title
      }
    }
    vendor
  }
`;
