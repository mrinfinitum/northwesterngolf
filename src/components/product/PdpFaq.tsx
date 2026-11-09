"use client";

import { useState } from "react";
import type { FaqSection } from "@/lib/product-content";
import { FaqChevronIcon } from "./icons";

export function PdpFaq({ section }: { section: FaqSection }) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(section.items.flatMap((item, index) => (item.open ? [index] : []))),
  );

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <section className="nwg-pdp-faq">
      <div className="nwg-pdp-faq__container">
        <div className="nwg-pdp-faq__header">
          <h2 className="nwg-pdp-faq__heading">{section.heading}</h2>
          <p className="nwg-pdp-faq__subheading">{section.subheading}</p>
        </div>
        <div className="nwg-pdp-faq__list">
          {section.items.map((item, index) => {
            const isOpen = open.has(index);
            return (
              <div className={`nwg-pdp-faq__item${isOpen ? " is-open" : ""}`} key={item.question}>
                <button aria-expanded={isOpen} className="nwg-pdp-faq__question" onClick={() => toggle(index)} type="button">
                  <span>{item.question}</span>
                  <FaqChevronIcon className="nwg-pdp-faq__icon" />
                </button>
                <div className="nwg-pdp-faq__divider" />
                <div className="nwg-pdp-faq__answer" inert={!isOpen}>
                  <div className="nwg-pdp-faq__answer-content" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
