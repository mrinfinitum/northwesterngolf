import type { Metadata } from "next";
import { pageSections } from "@/components/pages/page-sections";
import { siteUrl, socialLinks } from "@/config/site";

export function metadataTitle(title: string): Metadata["title"] {
  return /northwestern golf/i.test(title) ? { absolute: title } : title;
}

/** Site-wide share card (1200×630) for routes without their own image. */
export const defaultShareImage = {
  alt: "Northwestern Golf × John Daly",
  height: 630,
  url: "/images/og-default.jpg",
  width: 1200,
};

/**
 * Next replaces (not merges) a parent's `openGraph`, so every route that sets
 * its own must spread this to keep the site-wide fields.
 */
export const openGraphBase: {
  images: Array<typeof defaultShareImage>;
  locale: "en_US";
  siteName: "Northwestern Golf";
  type: "website";
} = {
  images: [defaultShareImage],
  locale: "en_US",
  siteName: "Northwestern Golf",
  type: "website",
};

/** Shopify pages rendered by a dedicated route or section layout rather than their body HTML. */
const designedPageHandles = new Set(["john-daly", "our-story", ...Object.keys(pageSections)]);

/** A Shopify page whose body is empty has nothing to rank; keep it out of the index and sitemap. */
export function isThinPage(handle: string, bodySummary: string | null | undefined) {
  return !designedPageHandles.has(handle) && !bodySummary?.trim();
}

/** Organization + WebSite structured data for the homepage. */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": `${siteUrl}/#organization`,
      "@type": "Organization",
      logo: `${siteUrl}/images/northwestern-logo.svg`,
      name: "Northwestern Golf",
      sameAs: socialLinks.map((link) => link.href),
      url: siteUrl,
    },
    {
      "@id": `${siteUrl}/#website`,
      "@type": "WebSite",
      name: "Northwestern Golf",
      publisher: { "@id": `${siteUrl}/#organization` },
      url: siteUrl,
    },
  ],
};

/** Serialises JSON-LD for a <script> tag without allowing `</script>` breakouts. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
