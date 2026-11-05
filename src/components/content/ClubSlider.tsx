"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

export type ClubSlide = {
  compareAtPrice?: string;
  eyebrow?: string;
  handle: string;
  image?: { alt: string; height: number; url: string; width: number };
  price: string;
  soldOut: boolean;
  title: string;
};

/**
 * Product row carousel: four cards per view on desktop, with the next card
 * peeking on smaller screens. Scrolling and swiping are native (CSS
 * scroll-snap); this component only drives the edge arrows.
 */
export function ClubSlider({
  heading,
  href,
  linkLabel,
  slides,
}: {
  heading: string;
  href: string;
  linkLabel: string;
  slides: ClubSlide[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ end: false, start: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = track.scrollWidth - track.clientWidth;
        setEdges({ end: track.scrollLeft >= max - 2, start: track.scrollLeft <= 2 });
      });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ behavior: "smooth", left: direction * (card.offsetWidth + gap) });
  };

  return (
    <section aria-label={heading} className="club-row">
      <div className="club-row__header">
        <h2 className="club-row__heading">{heading}</h2>
        <Link className="club-row__all" href={href}>{linkLabel}</Link>
      </div>

      <div className="club-row__viewport">
        <ul className="club-row__track" ref={trackRef}>
          {slides.map((slide) => (
            <li className="club-row__card" key={slide.handle}>
              <Link className="club-row__link" href={`/products/${slide.handle}`}>
                <span className="club-row__figure">
                  {slide.image ? (
                    <Image
                      alt={slide.image.alt}
                      className="club-row__image"
                      height={slide.image.height}
                      sizes="(max-width: 699px) 72vw, (max-width: 1099px) 33vw, 25vw"
                      src={slide.image.url}
                      width={slide.image.width}
                    />
                  ) : null}
                  {slide.soldOut ? <span className="club-row__badge">Sold out</span> : null}
                </span>
                {slide.eyebrow ? <span className="club-row__eyebrow">{slide.eyebrow}</span> : null}
                <span className="club-row__title">{slide.title}</span>
                <span className="club-row__price">
                  {slide.price}
                  {slide.compareAtPrice ? <s>{slide.compareAtPrice}</s> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          aria-label="Previous clubs"
          className="club-row__arrow club-row__arrow--prev"
          disabled={edges.start}
          onClick={() => step(-1)}
          type="button"
        >
          <ChevronLeftIcon />
        </button>
        <button
          aria-label="Next clubs"
          className="club-row__arrow club-row__arrow--next"
          disabled={edges.end}
          onClick={() => step(1)}
          type="button"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}
