"use client";

import { useRef, useState } from "react";
import type { ProductReview } from "@/lib/product-content/reviews";
import { StarIcon } from "./icons";

/** One review at a time in a centred card, with side arrows and dots. */
export function ReviewSlider({ reviews }: { reviews: ProductReview[] }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = reviews.length;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
      aria-roledescription="carousel"
      className="nwg-review-slider"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(index - 1);
        if (event.key === "ArrowRight") go(index + 1);
      }}
    >
      <button aria-label="Previous review" className="nwg-review-slider__arrow nwg-review-slider__arrow--prev" onClick={() => go(index - 1)} type="button">‹</button>
      <div
        className="nwg-review-slider__viewport"
        onPointerDown={(event) => { startX.current = event.clientX; }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const delta = event.clientX - startX.current;
          startX.current = null;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
        }}
      >
        <ul className="nwg-review-slider__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {reviews.map((review, position) => (
            <li
              aria-hidden={position !== index}
              aria-label={`Review ${position + 1} of ${count}`}
              className="nwg-review-slider__slide"
              key={review.dateCreated + review.reviewer.name}
              role="group"
            >
              <article className="nwg-review-card">
                <span aria-label={`Rated ${review.rating} out of 5 stars`} className="nwg-review-card__stars" role="img">
                  {Array.from({ length: 5 }, (_, star) => (
                    <StarIcon className={star < Math.round(review.rating) ? "is-filled" : undefined} key={star} />
                  ))}
                </span>
                <p className="nwg-review-card__body">{review.body}</p>
                <p className="nwg-review-card__name">{review.reviewer.name}</p>
                <p className="nwg-review-card__meta">
                  {review.reviewer.verified ? "Verified buyer" : "Customer"} · {review.title}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <button aria-label="Next review" className="nwg-review-slider__arrow nwg-review-slider__arrow--next" onClick={() => go(index + 1)} type="button">›</button>
      <div className="nwg-review-slider__dots">
        {reviews.map((review, position) => (
          <button
            aria-current={position === index}
            aria-label={`Show review ${position + 1}`}
            className="nwg-review-slider__dot"
            key={review.dateCreated + review.reviewer.name}
            onClick={() => go(position)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
