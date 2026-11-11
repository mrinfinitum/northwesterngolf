import { formatMoney } from "@/components/commerce/Money";
import { siteUrl, socialLinks } from "@/config/site";
import { pastModelGroups } from "@/lib/product-content/past-models";
import { getProducts, isShopifyConfigured, type Product } from "@/lib/shopify";

// llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI assistants.
// Products on sale come from Shopify; regenerate hourly like the rest of the catalogue.
export const revalidate = 3600;

function price(product: Product) {
  const { maxVariantPrice: max, minVariantPrice: min } = product.priceRange;
  return min.amount === max.amount ? formatMoney(min) : `${formatMoney(min)} – ${formatMoney(max)}`;
}

function productEntry(product: Product) {
  const description = product.description.trim();
  return `- [${product.title}](${siteUrl}/products/${product.handle}): ${price(product)}${product.availableForSale ? "" : " (currently sold out)"}.${description ? ` ${description}` : ""}`;
}

export async function GET() {
  const products = isShopifyConfigured() ? await getProducts({ first: 50, sortKey: "TITLE" }).catch(() => []) : [];

  const body = [
    "# Northwestern Golf",
    "",
    "> Northwestern Golf has made golf clubs for everyday golfers since 1929. The site sells complete golf club sets online at northwestern.golf, and keeps an archive of discontinued Thunderbird and Talon SS models.",
    "",
    "## Club sets",
    "",
    ...(products.length ? products.map(productEntry) : [`- [Shop all club sets](${siteUrl}/collections/all)`]),
    "",
    "## Past models (no longer sold)",
    "",
    ...pastModelGroups.map((group) => `- [${group.heading}](${siteUrl}/pages/past-models#${group.id}): ${group.models.map((model) => model.title).join(", ")}`),
    "",
    "## About",
    "",
    `- [Our Story](${siteUrl}/pages/our-story): Northwestern Golf's history and values`,
    `- [John Daly](${siteUrl}/pages/john-daly): the two-time major champion's partnership with Northwestern Golf`,
    `- [Contact](${siteUrl}/pages/contact): customer support, phone, email and address`,
    "",
    "## Policies",
    "",
    `- [Refund policy](${siteUrl}/policies/refund-policy)`,
    `- [Privacy policy](${siteUrl}/policies/privacy-policy)`,
    `- [Terms of service](${siteUrl}/policies/terms-of-service)`,
    "",
    "## Optional",
    "",
    `- [Shop all](${siteUrl}/collections/all)`,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    ...socialLinks.map((link) => `- [${link.label}](${link.href})`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
