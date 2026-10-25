import "server-only";

import {
  footerGroups,
  footerMenuHandles,
  primaryNavigation,
  type FooterGroup,
  type NavigationItem,
} from "@/config/site";
import { getMenu, type ShopifyMenuItem } from ".";

const STORE_HOSTS = new Set([
  "northwestern.golf",
  "www.northwestern.golf",
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

function toLinks(items: ShopifyMenuItem[]) {
  return items.flatMap((item) => {
    const href = toStorefrontPath(item.url);
    return href ? [{ href, label: item.title }] : [];
  });
}

/** Header navigation from the Shopify `main-menu`, falling back to static config. */
export async function getMainNavigation(): Promise<NavigationItem[]> {
  const menu = await getMenu("main-menu");
  if (!menu?.items.length) return primaryNavigation;

  return menu.items.map((item) => {
    const children = toLinks(item.items ?? []);
    return {
      href: toStorefrontPath(item.url),
      label: item.title,
      ...(children.length ? { children } : {}),
    };
  });
}

/** Footer link columns from Shopify menus, each falling back to static config. */
export async function getFooterNavigation(): Promise<FooterGroup[]> {
  const menus = await Promise.all(footerMenuHandles.map((handle) => getMenu(handle)));

  return menus.map((menu, index) => {
    const links = menu ? toLinks(menu.items) : [];
    return menu && links.length ? { heading: menu.title, links } : footerGroups[index];
  });
}
