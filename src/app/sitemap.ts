import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/shopify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts({ first: 100, sortKey: "TITLE" }),
    getCollections(100),
  ]);

  return [
    { changeFrequency: "weekly", priority: 1, url: "https://northwestern.golf" },
    { changeFrequency: "weekly", priority: 0.9, url: "https://northwestern.golf/collections/all" },
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
