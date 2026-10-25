"use client";

/* eslint-disable @next/next/no-img-element -- press artwork is square CDN media */
import { useEffect, useRef, useState } from "react";
import type { PressScrollerSection } from "@/lib/product-content";

/**
 * "Images with text scrolling" (reveal mode): quotes scroll in the left
 * column while the matching artwork is revealed in a sticky frame. Mobile
 * stacks image + quote pairs.
 */
export function PdpPressScroller({ section }: { section: PressScrollerSection }) {
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function update() {
      const threshold = window.innerHeight * 0.75;
      let next = 0;
      contentRefs.current.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top < threshold) next = index;
      });
      setActiveIndex(next);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const counter = (index: number) => String(index + 1).padStart(2, "0");

  return (
    <section className="nwg-pdp-press">
      <div className="nwg-pdp-press__mobile">
        {section.items.map((item, index) => (
          <div className="nwg-pdp-press__mobile-item" key={item.image}>
            <img alt="" height={3000} loading="lazy" src={item.image} width={3000} />
            <div className="nwg-pdp-press__content">
              <span className="nwg-pdp-press__counter">{counter(index)}</span>
              <h3>{item.quote}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="nwg-pdp-press__desktop">
        <div className="nwg-pdp-press__list">
          {section.items.map((item, index) => (
            <div
              className={`nwg-pdp-press__content${index <= activeIndex ? " is-visible" : ""}`}
              key={item.image}
              ref={(element) => {
                contentRefs.current[index] = element;
              }}
            >
              <span className="nwg-pdp-press__counter">{counter(index)}</span>
              <h3>{item.quote}</h3>
            </div>
          ))}
        </div>
        <div className="nwg-pdp-press__media">
          {section.items.map((item, index) => (
            <img
              alt=""
              className={index === 0 ? undefined : index <= activeIndex ? "is-revealed" : undefined}
              height={3000}
              key={item.image}
              loading="lazy"
              src={item.image}
              width={3000}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
