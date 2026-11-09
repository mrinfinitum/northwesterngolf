import "server-only";

import {
  footerGroups,
  primaryNavigation,
  type FooterGroup,
  type NavigationItem,
} from "@/config/site";

const STORE_HOSTS = new Set([
  "northwestern.golf",
  "www.northwestern.golf",
  "checkout.northwestern.golf",
  "r1kikk-am.myshopify.com",
]);

/**
 * Converts a Shopify menu URL into an in-app path. Placeholder `#` links return
 * `undefined`; links to other hosts are kept absolute.
 */
export function toStorefrontPath(url: string): string | undefined {
  if (!url || url.trim().endsWith("#")) return undefined;

  try {
    const parsed = new URL(url, "https://northwestern.golf");
    if (!STORE_HOSTS.has(parsed.hostname)) return parsed.toString();
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
  } catch {
    return undefined;
  }
}

/**
 * Production keeps the original (pre-2026-11-05) menus. The live Shopify menus
 * were changed for the new site and are shared with dev, so they are not read
 * here. Old product links redirect to their tile on /pages/past-models.
 */
export async function getMainNavigation(): Promise<NavigationItem[]> {
  return primaryNavigation;
}

const PAST_MODEL_COLLECTIONS: Record<string, string> = {
  "/collections/drivers": "/pages/past-models#men-s-thunderbird-driver",
  "/collections/fairways": "/pages/past-models#men-s-thunderbird-fairway",
  "/collections/golf-bags": "/pages/past-models#thunderbird-golf-bag",
  "/collections/hybrids": "/pages/past-models#men-s-thunderbird-hybrid",
  "/collections/irons": "/pages/past-models#men-s-thunderbird-irons-set",
  "/collections/talon-ss-full-set": "/pages/past-models#talon-ss-full-sets",
  "/collections/thunderbird-full-set": "/pages/past-models#thunderbird-full-sets",
  "/collections/wedges": "/pages/past-models#men-s-thunderbird-wedge",
};

/** Original footer columns; the archived collections point at their Past Models tiles. */
export async function getFooterNavigation(): Promise<FooterGroup[]> {
  return footerGroups.map((group) => ({
    ...group,
    links: group.links.map((link) => ({ ...link, href: PAST_MODEL_COLLECTIONS[link.href] ?? link.href })),
  }));
}
