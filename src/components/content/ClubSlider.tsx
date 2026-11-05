"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

export type ClubSlide = {
  compareAtPrice?: string;
  handle: string;
  image?: { alt: string; height: number; url: string; width: number };
  price: string;
  soldOut: boolean;
  title: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * One-club-per-view carousel on white. Scrolling and swiping are native
 * (CSS scroll-snap); this component only drives the arrows and the counter.
 */
export function ClubSlider({
  eyebrow,
  href,
  linkLabel,
  slides,
}: {
  eyebrow: string;
  href: string;
  linkLabel: string;
  slides: ClubSlide[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setIndex(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
      });
    };
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      track.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = (next + slides.length) % slides.length;
    track.scrollTo({ behavior: "smooth", left: target * track.clientWidth });
  };

  return (
    <section aria-roledescription="carousel" aria-label={eyebrow} className="club-slider">
      <div className="club-slider__header">
        <h2 className="club-slider__eyebrow">{eyebrow}</h2>
        <Link className="club-slider__all" href={href}>{linkLabel}</Link>
      </div>

      <div className="club-slider__track" ref={trackRef} tabIndex={0}>
        {slides.map((slide, slideIndex) => (
          <article
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            aria-roledescription="slide"
            className="club-slider__slide"
            key={slide.handle}
          >
            <Link className="club-slider__figure" href={`/products/${slide.handle}`} tabIndex={-1}>
              {slide.image ? (
                <Image
                  alt={slide.image.alt}
                  className="club-slider__image"
                  height={slide.image.height}
                  sizes="(max-width: 699px) 86vw, 560px"
                  src={slide.image.url}
                  width={slide.image.width}
                />
              ) : null}
            </Link>
            <div className="club-slider__info">
              <h3 className="club-slider__title">
                <Link href={`/products/${slide.handle}`}>{slide.title}</Link>
              </h3>
              <p className="club-slider__price">
                <span>{slide.price}</span>
                {slide.compareAtPrice ? <s>{slide.compareAtPrice}</s> : null}
                {slide.soldOut ? <span className="club-slider__status">Sold out</span> : null}
              </p>
              <Link className="club-slider__cta" href={`/products/${slide.handle}`}>Shop now</Link>
            </div>
          </article>
        ))}
      </div>

      <div className="club-slider__controls">
        <p aria-live="polite" className="club-slider__counter">
          <span>{pad(index + 1)}</span> / {pad(slides.length)}
        </p>
        <div aria-hidden="true" className="club-slider__progress">
          <span style={{ transform: `scaleX(${(index + 1) / slides.length})` }} />
        </div>
        <div className="club-slider__arrows">
          <button aria-label="Previous club" className="club-slider__arrow" onClick={() => go(index - 1)} type="button">
            <ChevronLeftIcon />
          </button>
          <button aria-label="Next club" className="club-slider__arrow" onClick={() => go(index + 1)} type="button">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
