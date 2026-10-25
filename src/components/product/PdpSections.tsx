import type { PdpSection } from "@/lib/product-content";
import { PdpEditorialGrid } from "./PdpEditorialGrid";
import { PdpFaq } from "./PdpFaq";
import { PdpMarquee } from "./PdpMarquee";
import { PdpPressScroller } from "./PdpPressScroller";
import { PdpRelatedProducts } from "./PdpRelatedProducts";
import { PdpReviews } from "./PdpReviews";
import { PdpSocialFeed } from "./PdpSocialFeed";
import { PdpSplitTile } from "./PdpSplitTile";
import { PdpFeatureVideo, PdpRichText } from "./PdpStory";

/** Renders the template sections below the main product section, in live order. */
export function PdpSections({ handle, sections }: { handle: string; sections: PdpSection[] }) {
  return sections.map((section, index) => {
    const key = `${section.type}-${index}`;
    switch (section.type) {
      case "marquee":
        return <PdpMarquee key={key} section={section} />;
      case "editorialGrid":
        return <PdpEditorialGrid key={key} section={section} />;
      case "socialFeed":
        return <PdpSocialFeed handle={handle} key={key} />;
      case "pressScroller":
        return <PdpPressScroller key={key} section={section} />;
      case "splitTile":
        return <PdpSplitTile key={key} section={section} />;
      case "richText":
        return <PdpRichText key={key} section={section} />;
      case "featureVideo":
        return <PdpFeatureVideo key={key} section={section} />;
      case "faq":
        return <PdpFaq key={key} section={section} />;
      case "relatedProducts":
        return <PdpRelatedProducts handle={handle} key={key} section={section} />;
      case "reviews":
        return <PdpReviews handle={handle} key={key} />;
      default:
        return null;
    }
  });
}
