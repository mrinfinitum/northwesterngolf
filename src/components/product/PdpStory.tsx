import type { FeatureVideoSection, RichTextSection } from "@/lib/product-content";
import { FeatureVideoPlayer } from "./FeatureVideoPlayer";

export function PdpRichText({ section }: { section: RichTextSection }) {
  return (
    <section className="nwg-pdp-richtext">
      <div className="nwg-pdp-richtext__inner">
        <p className="nwg-pdp-richtext__heading">{section.heading}</p>
        <div className="nwg-pdp-richtext__body" dangerouslySetInnerHTML={{ __html: section.bodyHtml }} />
      </div>
    </section>
  );
}

export function PdpFeatureVideo({ section }: { section: FeatureVideoSection }) {
  return (
    <section className="nwg-pdp-feature-video">
      <FeatureVideoPlayer video={section.video} />
    </section>
  );
}
