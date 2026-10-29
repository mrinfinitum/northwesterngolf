import type { MetadataRoute } from "next";
import { noindexPageHandles } from "@/config/site";
import {
  getCollections,
  getContentIndex,
  getProducts,
  isShopifyConfigured,
} from "@/lib/shopify";

const SITE = "https://northwestern.golf";

const staticRoutes: MetadataRoute.Sitemap = [
  { changeFrequency: "weekly", priority: 1, url: SITE },
  { changeFrequency: "weekly", priority: 0.9, url: `${SITE}/collections/all` },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isShopifyConfigured()) return staticRoutes;

  const [products, collections, content] = await Promise.all([
    getProducts({ first: 100, sortKey: "TITLE" }),
    getCollections(100),
    getContentIndex(),
  ]);

  return [
    ...staticRoutes,
    ...collections.map((collection) => ({
      changeFrequency: "weekly" as const,
      lastModified: collection.updatedAt,
      priority: 0.8,
      url: `${SITE}/collections/${collection.handle}`,
    })),
    ...products.map((product) => ({
      changeFrequency: "weekly" as const,
      images: product.featuredImage ? [product.featuredImage.url] : undefined,
      lastModified: product.updatedAt,
      priority: 0.8,
      url: `${SITE}/products/${product.handle}`,
    })),
    ...content.pages.filter((page) => !noindexPageHandles.has(page.handle)).map((page) => ({
      changeFrequency: "monthly" as const,
      lastModified: page.updatedAt,
      priority: 0.5,
      url: `${SITE}/pages/${page.handle}`,
    })),
    ...content.blogs.map((blog) => ({
      changeFrequency: "weekly" as const,
      priority: 0.5,
      url: `${SITE}/blogs/${blog}`,
    })),
    ...content.articles.map((article) => ({
      changeFrequency: "monthly" as const,
      lastModified: article.publishedAt,
      priority: 0.5,
      url: `${SITE}/blogs/${article.blogHandle}/${article.handle}`,
    })),
  ];
}
