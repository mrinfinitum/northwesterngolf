"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

const AUTOPLAY_MS = 4000;

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

  const sectionRef = useRef<HTMLElement>(null);
  /** Set once the shopper swipes, scrolls or uses the arrows: autoplay stops for good. */
  const userTookOver = useRef(false);

  const step = (direction: 1 | -1, { auto = false } = {}) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    if (!auto) userTookOver.current = true;
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    if (auto && atEnd) {
      track.scrollTo({ behavior: "smooth", left: 0 });
      return;
    }
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ behavior: "smooth", left: direction * (card.offsetWidth + gap) });
  };

  // Autoplay: one card every few seconds while the row is on screen, paused
  // on hover/focus, skipped for reduced motion, stopped after user input.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let hovered = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.6 });
    observer.observe(section);

    const takeOver = () => { userTookOver.current = true; };
    const enter = () => { hovered = true; };
    const leave = () => { hovered = false; };
    track.addEventListener("pointerdown", takeOver);
    track.addEventListener("wheel", takeOver, { passive: true });
    track.addEventListener("touchstart", takeOver, { passive: true });
    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointerleave", leave);

    const timer = window.setInterval(() => {
      const focused = section.contains(document.activeElement);
      if (userTookOver.current || !visible || hovered || focused || document.hidden) return;
      step(1, { auto: true });
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      track.removeEventListener("pointerdown", takeOver);
      track.removeEventListener("wheel", takeOver);
      track.removeEventListener("touchstart", takeOver);
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointerleave", leave);
    };
  }, [slides.length]);

  return (
    <section aria-label={heading} className={`club-row${slides.length <= 3 ? " club-row--few" : ""}`} ref={sectionRef}>
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
                      sizes={slides.length <= 3 ? "(max-width: 699px) 80vw, 33vw" : "(max-width: 699px) 72vw, (max-width: 1099px) 33vw, 25vw"}
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
