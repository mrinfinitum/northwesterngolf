import { IMAGE_FRAGMENT } from "../fragments/image";
import { SEO_FRAGMENT } from "../fragments/seo";

const ARTICLE_SUMMARY_FRAGMENT = /* GraphQL */ `
  fragment articleSummary on Article {
    excerpt
    handle
    id
    image { ...image }
    publishedAt
    title
  }
`;

export const BLOG_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
  ${ARTICLE_SUMMARY_FRAGMENT}
  query Blog($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      handle
      id
      seo { ...seo }
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        nodes { ...articleSummary }
      }
    }
  }
`;

export const ARTICLE_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
  query Article($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      handle
      title
      articleByHandle(handle: $articleHandle) {
        authorV2 { name }
        contentHtml
        excerpt
        handle
        id
        image { ...image }
        publishedAt
        seo { ...seo }
        title
      }
    }
  }
`;

export const CONTENT_INDEX_QUERY = /* GraphQL */ `
  query ContentIndex {
    blogs(first: 20) {
      nodes {
        handle
        articles(first: 100) { nodes { handle publishedAt } }
      }
    }
    pages(first: 100) { nodes { handle updatedAt } }
  }
`;
