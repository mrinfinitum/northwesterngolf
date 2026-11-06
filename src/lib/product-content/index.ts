import { PRODUCT_TEMPLATES } from "./templates";
import type { PdpSection, ProductPageContent, ProductPageTemplate } from "./types";

export type * from "./types";

/**
 * Live templates are per product (every product has its own Shopify template
 * with the same section layout). Products added later fall back to a generic
 * template built from the content every live template shares.
 */
const DEFAULT_SOURCE_HANDLE = "men-s-thunderbird-full-set";
const GENERIC_SECTION_TYPES = new Set<PdpSection["type"]>([
  "marquee",
  "socialFeed",
  "pressScroller",
  "richText",
  "featureVideo",
  "faq",
  "relatedProducts",
  "reviews",
]);

function buildDefaultTemplate(): ProductPageTemplate {
  const source = PRODUCT_TEMPLATES[DEFAULT_SOURCE_HANDLE];
  return {
    id: "default",
    info: {
      accordions: source.info.accordions.filter((item) => /SHIPPING/i.test(item.title)),
      govx: source.info.govx,
      introHtml: null,
      offers: source.info.offers,
    },
    sections: source.sections
      .filter((section) => GENERIC_SECTION_TYPES.has(section.type))
      .map((section) => (section.type === "relatedProducts" ? { ...section, handles: [] } : section)),
  };
}

const DEFAULT_TEMPLATE = buildDefaultTemplate();

/**
 * Single entry point for product-page template content. Swap the static map
 * for a metafield/metaobject query here without touching the components.
 */
export async function getProductPageContent(handle: string): Promise<ProductPageContent> {
  return PRODUCT_TEMPLATES[handle] ?? DEFAULT_TEMPLATE;
}
