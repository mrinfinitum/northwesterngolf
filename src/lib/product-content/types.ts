/**
 * Typed product-page content that, on the live Shopify theme, lives in
 * per-product templates (custom AI blocks, app blocks and metafield-backed
 * text). The Storefront API cannot read that content without a private token,
 * so it is mirrored statically in ./templates.ts. A future metafield/metaobject
 * source only needs to return a `ProductPageContent` from
 * `getProductPageContent()` in ./index.ts.
 */

export type HtmlString = string;

export type VideoSource = { src: string; type: string };

export type PdpVideo = {
  poster?: string;
  sources: VideoSource[];
};

export type ProductInfoContent = {
  /** Rich text shown under the title (tagline + intro copy). */
  introHtml: HtmlString | null;
  /** Trust cards rendered under the buy button. */
  offers: Array<{ icon: "timer" | "shield" | "box"; text: string }>;
  /** GOVX ID verified-discount bar (third-party app block). */
  govx: boolean;
  /** Product rating summary shown beside the price (Shopify reviews metafield). */
  rating?: { count: number; value: number };
  accordions: Array<{ title: string; html: HtmlString }>;
};

export type MarqueeSection = {
  type: "marquee";
  text: string;
  icon: string;
  background?: string;
  /** Animation durations in seconds. */
  duration: { desktop: number; mobile: number };
};

export type EditorialGridSection = {
  type: "editorialGrid";
  columns: Array<{ image: string; heading: string; bodyHtml: HtmlString }>;
};

export type SocialFeedSection = {
  type: "socialFeed";
};

export type PressScrollerSection = {
  type: "pressScroller";
  items: Array<{ image: string; quote: string }>;
};

export type SplitTileSection = {
  type: "splitTile";
  /** "media-left" tiles are full-viewport tall, "media-right" tiles are compact. */
  layout: "media-left" | "media-right";
  video: PdpVideo;
  barImage: string;
  heading: string;
  bodyHtml: HtmlString;
  /** Per-tile typography/spacing overrides as CSS custom properties. */
  style?: Record<string, string>;
};

export type RichTextSection = {
  type: "richText";
  heading: string;
  bodyHtml: HtmlString;
};

export type FeatureVideoSection = {
  type: "featureVideo";
  video: PdpVideo;
};

export type FaqSection = {
  type: "faq";
  heading: string;
  subheading: string;
  items: Array<{ question: string; answerHtml: HtmlString; open?: boolean }>;
};

export type RelatedProductsSection = {
  type: "relatedProducts";
  heading: string;
  /**
   * Fallback product handles (as rendered on live). Used when Shopify's
   * Storefront recommendations return nothing for the product.
   */
  handles: string[];
};

export type ReviewsSection = {
  type: "reviews";
};

export type PdpSection =
  | MarqueeSection
  | EditorialGridSection
  | SocialFeedSection
  | PressScrollerSection
  | SplitTileSection
  | RichTextSection
  | FeatureVideoSection
  | FaqSection
  | RelatedProductsSection
  | ReviewsSection;

export type ProductPageTemplate = {
  id: string;
  info: ProductInfoContent;
  sections: PdpSection[];
};

export type ProductPageContent = ProductPageTemplate;
