import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments (dev.northwestern.golf) must never be crawled.
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { disallow: "/", userAgent: "*" } };
  }
  return {
    rules: {
      allow: "/",
      disallow: ["/api/", "/cart", "/search"],
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
