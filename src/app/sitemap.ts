import type { MetadataRoute } from "next";
import { getCollections, getProducts, isShopifyConfigured } from "@/lib/shopify";

const staticRoutes: MetadataRoute.Sitemap = [
  { changeFrequency: "weekly", priority: 1, url: "https://northwestern.golf" },
  { changeFrequency: "weekly", priority: 0.9, url: "https://northwestern.golf/collections/all" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isShopifyConfigured()) return staticRoutes;

  const [products, collections] = await Promise.all([
    getProducts({ first: 100, sortKey: "TITLE" }),
    getCollections(100),
  ]);

  return [
    ...staticRoutes,
    ...collections.map((collection) => ({
      changeFrequency: "weekly" as const,
      lastModified: collection.updatedAt,
      priority: 0.8,
      url: `https://northwestern.golf/collections/${collection.handle}`,
    })),
    ...products.map((product) => ({
      changeFrequency: "weekly" as const,
      images: product.featuredImage ? [product.featuredImage.url] : undefined,
      lastModified: product.updatedAt,
      priority: 0.8,
      url: `https://northwestern.golf/products/${product.handle}`,
    })),
  ];
}
