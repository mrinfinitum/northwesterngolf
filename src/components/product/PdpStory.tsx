import type { FeatureVideoSection, RichTextSection } from "@/lib/product-content";
import { AutoplayVideo } from "./AutoplayVideo";

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
      <div className="nwg-pdp-feature-video__frame">
        <AutoplayVideo video={section.video} />
      </div>
    </section>
  );
}
