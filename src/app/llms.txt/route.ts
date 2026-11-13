import { formatMoney } from "@/components/commerce/Money";
import { siteUrl, socialLinks } from "@/config/site";
import { signatureSetContents } from "@/lib/product-content";
import { getProducts, isShopifyConfigured, type Product } from "@/lib/shopify";

// llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI assistants.
// Product data comes from Shopify; regenerate hourly like the rest of the catalogue.
export const revalidate = 3600;

function price(product: Product) {
  const { maxVariantPrice: max, minVariantPrice: min } = product.priceRange;
  return min.amount === max.amount ? formatMoney(min) : `${formatMoney(min)} – ${formatMoney(max)}`;
}

function productEntry(product: Product) {
  const contents = signatureSetContents[product.handle];
  const lines = [
    `- [${product.title}](${siteUrl}/products/${product.handle}): ${price(product)}${product.availableForSale ? "" : " (currently sold out)"}. ${product.description.trim()}`,
  ];
  if (contents) lines.push(`  - In the set: ${contents.join(", ")}`);
  return lines.join("\n");
}

export async function GET() {
  const products = isShopifyConfigured() ? await getProducts({ first: 50, sortKey: "TITLE" }).catch(() => []) : [];

  const body = [
    "# Northwestern Golf",
    "",
    "> Northwestern Golf makes golf clubs for real golfers, priced for the people. Its current line is the John Daly Signature Sets: complete men's and junior golf club sets, each with a matching stand bag, sold online at northwestern.golf.",
    "",
    "## Club sets",
    "",
    ...(products.length ? products.map(productEntry) : [`- [Shop all club sets](${siteUrl}/collections/all)`]),
    "",
    "## About",
    "",
    `- [John Daly](${siteUrl}/pages/john-daly): the two-time major champion's partnership with Northwestern Golf and the Signature Sets`,
    `- [Our Story](${siteUrl}/pages/our-story): Northwestern Golf's history and values`,
    `- [Contact](${siteUrl}/pages/contact): customer support, phone, email and address`,
    "",
    "## Policies",
    "",
    `- [Refund policy](${siteUrl}/policies/refund-policy)`,
    `- [Shipping policy](${siteUrl}/policies/shipping-policy): $20 standard shipping to U.S. addresses`,
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
