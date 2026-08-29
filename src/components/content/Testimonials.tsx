"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { testimonials } from "@/config/site";

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("figure");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0");
    track.scrollBy({ behavior: "smooth", left: direction * ((card?.offsetWidth ?? track.clientWidth) + gap) });
  }

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const atEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth;
      if (atEnd) track.scrollTo({ behavior: "smooth", left: 0 });
      else move(1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="testimonials"
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonials__inner section-shell">
        <header>
          <p>Customer Reviews</p>
          <h2>Golfers Are Talking</h2>
          <span>Real feedback from players who choose Northwestern Golf.</span>
        </header>
        <div className="testimonials__viewport">
          <div className="testimonials__track" ref={trackRef}>
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author}>
                <div aria-label="5 out of 5 stars" className="stars">★★★★★</div>
                <blockquote>“{testimonial.quote}”</blockquote>
                <figcaption>{testimonial.author}</figcaption>
              </figure>
            ))}
          </div>
          <div className="testimonials__controls">
            <button aria-label="Previous testimonial" onClick={() => move(-1)} type="button"><ChevronLeftIcon /></button>
            <button aria-label="Next testimonial" onClick={() => move(1)} type="button"><ChevronRightIcon /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
