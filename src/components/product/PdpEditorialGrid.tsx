/* eslint-disable @next/next/no-img-element -- store-authored media keeps its natural aspect ratio */
import type { EditorialGridSection } from "@/lib/product-content";

export function PdpEditorialGrid({ section }: { section: EditorialGridSection }) {
  return (
    <section className="nwg-pdp-editorial">
      <div className="nwg-pdp-editorial__columns">
        {section.columns.map((column) => (
          <div className="nwg-pdp-editorial__column" key={column.heading}>
            <div className="nwg-pdp-editorial__media">
              <img alt="" loading="lazy" src={column.image} />
            </div>
            <h3 className="nwg-pdp-editorial__heading">{column.heading}</h3>
            <div className="nwg-pdp-editorial__body" dangerouslySetInnerHTML={{ __html: column.bodyHtml }} />
          </div>
        ))}
      </div>
    </section>
  );
}
