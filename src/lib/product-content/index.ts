import { PRODUCT_TEMPLATES } from "./templates";
import type { PdpSection, ProductPageContent, ProductPageTemplate } from "./types";

export type * from "./types";

/**
 * Live templates are per product (every product has its own Shopify template
 * with the same section layout). Products added later fall back to a generic
 * template built from the content every live template shares.
 */
const DEFAULT_SOURCE_HANDLE = "men-s-thunderbird-full-set";
// No marquees, social feed, press scroller or "Tradition, Reengineered" copy:
// the feature video leads (swap its source for the new product video).
const GENERIC_SECTION_TYPES = new Set<PdpSection["type"]>([
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

function setIntro(lead: string, body: string, contents: string[]): string {
  return [
    `<p class="nwg-pdp-set-lead">${lead}</p>`,
    `<p>${body}</p>`,
    `<p class="nwg-pdp-set-heading">What’s in the set</p>`,
    `<ul class="nwg-pdp-set-list">${contents.map((item) => `<li>${item}</li>`).join("")}</ul>`,
  ].join("");
}

/** Doral shoot reel: landscape cut, with the vertical cut on phones. */
function doralVideo(name: "daly-doral-3" | "daly-doral-4"): PdpSection {
  return {
    type: "featureVideo",
    video: {
      poster: `/videos/${name}-poster.jpg`,
      sources: [
        { media: "(max-width: 699px)", src: `/videos/${name}-mobile.mp4`, type: "video/mp4" },
        { src: `/videos/${name}.mp4`, type: "video/mp4" },
      ],
    },
  };
}

/** What ships in each John Daly Signature Set, keyed by product handle (also used by /llms.txt). */
export const signatureSetContents: Record<string, string[]> = {
  "junior-john-daly-signature-set-ages-5-8": ["Driver", "Hybrid", "7 Iron", "Sand Wedge", "Putter", "Bag"],
  "junior-john-daly-signature-set-ages-9-12": ["Driver", "Fairway Wood", "Hybrid", "7 Iron", "Wedge", "Putter", "Bag"],
  "mens-john-daly-signature-set": ["Driver", "3-Wood", "5-Wood", "5-PW", "Sand Wedge", "Putter", "Bag"],
};

/** The John Daly Signature Sets: default template plus their own lead-in, contents and Doral reel. */
function signatureSetTemplate(id: string, introHtml: string, video: PdpSection): ProductPageTemplate {
  return {
    ...DEFAULT_TEMPLATE,
    id,
    info: { ...DEFAULT_TEMPLATE.info, introHtml },
    sections: DEFAULT_TEMPLATE.sections.map((section) => (section.type === "featureVideo" ? video : section)),
  };
}

const SIGNATURE_SET_TEMPLATES: Record<string, ProductPageTemplate> = {
  "junior-john-daly-signature-set-ages-5-8": signatureSetTemplate(
    "daly-junior-5-8",
    setIntro(
      "Grip it and rip it.",
      "Their first real set, made to make the game fun from the very first swing. Everything a young golfer needs to get out there, tee it high and send it like Daly.",
      signatureSetContents["junior-john-daly-signature-set-ages-5-8"],
    ),
    doralVideo("daly-doral-4"),
  ),
  "junior-john-daly-signature-set-ages-9-12": signatureSetTemplate(
    "daly-junior-9-12",
    setIntro(
      "Send it like Daly.",
      "The step-up set for growing players who are ready to swing big. Driver to putter, with a fairway wood for the long ones, so they can grip it and rip it all the way round.",
      signatureSetContents["junior-john-daly-signature-set-ages-9-12"],
    ),
    doralVideo("daly-doral-4"),
  ),
  "mens-john-daly-signature-set": signatureSetTemplate(
    "daly-mens",
    setIntro(
      "Grip it and rip it.",
      "Engineered to help you hit the longest, straightest drives of your life. A classic shape with modern, high-launch technology. Stop fixing your slice. Start splitting fairways, and send it like Daly.",
      signatureSetContents["mens-john-daly-signature-set"],
    ),
    doralVideo("daly-doral-3"),
  ),
};

/**
 * Single entry point for product-page template content. Swap the static map
 * for a metafield/metaobject query here without touching the components.
 */
export async function getProductPageContent(handle: string): Promise<ProductPageContent> {
  return SIGNATURE_SET_TEMPLATES[handle] ?? PRODUCT_TEMPLATES[handle] ?? DEFAULT_TEMPLATE;
}
