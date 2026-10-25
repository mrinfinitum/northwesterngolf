"use client";

import { useEffect, useRef, useState } from "react";
import { homepageContent, testimonials } from "@/config/site";

function step(track: HTMLElement) {
  const card = track.querySelector<HTMLElement>(".reviews__card");
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  return card ? card.offsetWidth + gap : 340;
}

function next(track: HTMLElement) {
  if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
    track.scrollTo({ behavior: "smooth", left: 0 });
  } else {
    track.scrollBy({ behavior: "smooth", left: step(track) });
  }
}

function previous(track: HTMLElement) {
  if (track.scrollLeft <= 10) {
    track.scrollTo({ behavior: "smooth", left: track.scrollWidth });
  } else {
    track.scrollBy({ behavior: "smooth", left: -step(track) });
  }
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { eyebrow, heading, subheading } = homepageContent.reviews;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (trackRef.current) next(trackRef.current);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="reviews"
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="reviews__container">
        <div className="reviews__header">
          <p>{eyebrow}</p>
          <h2>{heading}</h2>
          <span>{subheading}</span>
        </div>
        <div className="reviews__wrap">
          <button
            aria-label="Previous reviews"
            className="reviews__arrow reviews__arrow--prev"
            onClick={() => trackRef.current && previous(trackRef.current)}
            type="button"
          >
            ‹
          </button>
          <div className="reviews__scroll" ref={trackRef}>
            {testimonials.map((testimonial) => (
              <figure className="reviews__card" key={testimonial.author}>
                <div aria-label="5 out of 5 stars" className="reviews__stars" role="img">★★★★★</div>
                <blockquote className="reviews__text">“{testimonial.quote}”</blockquote>
                <figcaption className="reviews__author">{testimonial.author}</figcaption>
              </figure>
            ))}
          </div>
          <button
            aria-label="Next reviews"
            className="reviews__arrow reviews__arrow--next"
            onClick={() => trackRef.current && next(trackRef.current)}
            type="button"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
