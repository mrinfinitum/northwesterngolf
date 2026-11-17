import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments (dev.northwestern.golf) are kept out of search by the
  // X-Robots-Tag: noindex, nofollow header (next.config.ts). Crawling stays allowed
  // so search engines can actually see that header; a Disallow would hide it and
  // let linked dev URLs be listed as bare links. No sitemap, so nothing invites crawling.
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { allow: "/", userAgent: "*" } };
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
