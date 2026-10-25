import type { CSSProperties } from "react";
import type { MarqueeSection } from "@/lib/product-content";

const ITEM_COUNT = 20; // Live renders 20 items and scrolls the track by 50%.

export function PdpMarquee({ section }: { section: MarqueeSection }) {
  const style = {
    "--marquee-duration": `${section.duration.desktop}s`,
    "--marquee-duration-mobile": `${section.duration.mobile}s`,
    ...(section.background ? { backgroundImage: `url("${section.background}")` } : {}),
  } as CSSProperties;

  return (
    <section aria-label={section.text} className="nwg-pdp-marquee" style={style}>
      <div aria-hidden="true" className="nwg-pdp-marquee__track">
        {Array.from({ length: ITEM_COUNT }, (_, index) => (
          <div className="nwg-pdp-marquee__item" key={index}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="nwg-pdp-marquee__icon" src={section.icon} />
            <span className="nwg-pdp-marquee__text">{section.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
