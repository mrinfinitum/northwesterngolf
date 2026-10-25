/* eslint-disable @next/next/no-img-element -- decorative gradient bar keeps its natural ratio */
import type { CSSProperties } from "react";
import type { SplitTileSection } from "@/lib/product-content";
import { AutoplayVideo } from "./AutoplayVideo";

/** "Under the hood" media + copy tile (black panel with orange gradient bar). */
export function PdpSplitTile({ section }: { section: SplitTileSection }) {
  return (
    <section className={`nwg-pdp-tile nwg-pdp-tile--${section.layout}`} style={section.style as CSSProperties | undefined}>
      <div className="nwg-pdp-tile__media">
        <AutoplayVideo className="nwg-pdp-tile__video" video={section.video} />
      </div>
      <div className="nwg-pdp-tile__content">
        <div className="nwg-pdp-tile__inner">
          <div className="nwg-pdp-tile__bar">
            <img alt="" height={119} loading="lazy" src={section.barImage} width={1994} />
          </div>
          <h2 className="nwg-pdp-tile__heading">{section.heading}</h2>
          {section.layout === "media-right" ? <div aria-hidden="true" className="nwg-pdp-tile__spacing" /> : null}
          <div className="nwg-pdp-tile__body" dangerouslySetInnerHTML={{ __html: section.bodyHtml }} />
        </div>
      </div>
    </section>
  );
}
