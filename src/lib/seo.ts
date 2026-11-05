import type { Metadata } from "next";

export function metadataTitle(title: string): Metadata["title"] {
  return /northwestern golf/i.test(title) ? { absolute: title } : title;
}

/**
 * Next replaces (not merges) a parent's `openGraph`, so every route that sets
 * its own must spread this to keep the site-wide fields.
 */
export const openGraphBase = {
  locale: "en_US",
  siteName: "Northwestern Golf",
  type: "website",
} as const;
