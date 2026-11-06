import { getProductReviews, type ProductReview } from "@/lib/product-content/reviews";
import { StarIcon } from "./icons";

function Stars({ rating, size }: { rating: number; size: "lg" | "md" }) {
  return (
    <span aria-label={`Rated ${rating.toFixed(size === "lg" ? 1 : 0)} out of 5 stars`} className={`nwg-pdp-reviews__stars is-${size}`} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon className={index < Math.round(rating) ? "is-filled" : undefined} key={index} />
      ))}
    </span>
  );
}

function relativeDate(iso: string, now = Date.now()) {
  const days = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 86_400_000));
  const plural = (value: number, unit: string) => `${value} ${unit}${value === 1 ? "" : "s"} ago`;
  if (days < 1) return "Today";
  if (days < 7) return plural(days, "day");
  if (days < 30) return plural(Math.floor(days / 7), "week");
  if (days < 365) return plural(Math.max(1, Math.floor(days / 30.44)), "month");
  return plural(Math.floor(days / 365), "year");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ThumbIcon({ down = false }: { down?: boolean }) {
  return (
    <svg aria-hidden="true" height="12" style={down ? { transform: "scaleY(-1)" } : undefined} viewBox="0 0 16 16" width="12">
      <path d="M1 7h3v8H1zM5.5 15h6.8c.8 0 1.4-.5 1.6-1.2l1.3-4.8c.3-1-.5-1.9-1.5-1.9H10l.6-3.3c.1-.8-.5-1.6-1.3-1.7-.4 0-.8.2-1 .5L5.5 7.2V15Z" fill="currentColor" />
    </svg>
  );
}

function Review({ review }: { review: ProductReview }) {
  return (
    <li className="nwg-pdp-reviews__item">
      <article className="nwg-pdp-review">
        <div className="nwg-pdp-review__side">
          <div className="nwg-pdp-review__reviewer">
            <span aria-hidden="true" className="nwg-pdp-review__avatar">{initials(review.reviewer.name)}</span>
            <div>
              <strong className="nwg-pdp-review__name">{review.reviewer.name}</strong>
              {review.reviewer.verified ? (
                <span className="nwg-pdp-review__verified">
                  Verified Reviewer
                  <svg aria-hidden="true" height="12" viewBox="0 0 16 16" width="12"><circle cx="8" cy="8" fill="currentColor" r="8" /><path d="m4.5 8.2 2.3 2.3 4.7-4.8" fill="none" stroke="#fff" strokeWidth="1.8" /></svg>
                </span>
              ) : null}
            </div>
          </div>
          {review.recommends ? (
            <p className="nwg-pdp-review__recommends">
              <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14"><circle cx="8" cy="8" fill="currentColor" r="8" /><path d="M4 7.5h1.6v4H4zM6.4 11.5h3.7c.4 0 .8-.3.9-.7l.7-2.5c.1-.5-.3-1-.8-1H9.3l.3-1.7c.1-.4-.3-.8-.7-.8-.2 0-.4.1-.5.2L6.4 7.6v3.9Z" fill="#fff" /></svg>
              I recommend this product
            </p>
          ) : null}
        </div>
        <div className="nwg-pdp-review__main">
          <div className="nwg-pdp-review__top">
            <Stars rating={review.rating} size="md" />
            <time className="nwg-pdp-review__date" dateTime={review.dateCreated}>{relativeDate(review.dateCreated)}</time>
          </div>
          <h3 className="nwg-pdp-review__title">{review.title}</h3>
          <p className="nwg-pdp-review__body">{review.body}</p>
          <div className="nwg-pdp-review__footer">
            <span>Was this helpful?</span>
            <span className="nwg-pdp-review__vote"><ThumbIcon /> {review.helpful.yes}</span>
            <span className="nwg-pdp-review__vote"><ThumbIcon down /> {review.helpful.no}</span>
          </div>
        </div>
      </article>
    </li>
  );
}

/**
 * Static reproduction of the live Okendo reviews widget. Isolated so it can be
 * replaced by the vendor widget once API/script access is approved.
 */
export async function PdpReviews({ handle }: { handle: string }) {
  const summary = await getProductReviews(handle);
  const max = Math.max(1, ...Object.values(summary.distribution));

  return (
    <section aria-label={`Rated ${summary.average.toFixed(1)} out of 5 stars, based on ${summary.count} reviews`} className="nwg-pdp-reviews" id="nwg-pdp-reviews">
      <div className="nwg-pdp-reviews__header">
        <div className="nwg-pdp-reviews__summary">
          <div className="nwg-pdp-reviews__average">
            <span className="nwg-pdp-reviews__average-value">{summary.average.toFixed(1)}</span>
            <Stars rating={summary.average} size="lg" />
            <span className="nwg-pdp-reviews__average-count">Based on {summary.count} reviews</span>
          </div>
          <div aria-hidden="true" className="nwg-pdp-reviews__breakdown">
            {([5, 4, 3, 2, 1] as const).map((stars) => (
              <div className="nwg-pdp-reviews__breakdown-row" key={stars}>
                <span className="nwg-pdp-reviews__breakdown-label">
                  {stars}
                  <StarIcon className="is-filled" />
                </span>
                <span className="nwg-pdp-reviews__bar">
                  <span style={{ width: `${(summary.distribution[stars] / max) * 100}%` }} />
                </span>
                <span className="nwg-pdp-reviews__breakdown-count">{summary.distribution[stars]}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="nwg-pdp-reviews__recommend">
          <strong>{summary.recommendPercent}%</strong>
          <span>would recommend this product</span>
        </p>
      </div>

      <div className="nwg-pdp-reviews__actions">
        <span className="nwg-pdp-reviews__button">
          <svg aria-hidden="true" height="10" viewBox="0 0 14 10" width="12"><path d="M0 1h14M3 5h8M5.5 9h3" stroke="currentColor" strokeWidth="1.6" /></svg>
          Filters
        </span>
        <a className="nwg-pdp-reviews__button" href={summary.writeReviewUrl} rel="noopener noreferrer" target="_blank">
          <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12"><path d="M0 9.5V12h2.5l7.4-7.4-2.5-2.5L0 9.5Zm11.8-6.8a.66.66 0 0 0 0-.94L10.24.2a.66.66 0 0 0-.94 0L8.08 1.42l2.5 2.5 1.22-1.22Z" fill="currentColor" /></svg>
          Write a Review
          <span className="sr-only">(Opens in a new tab)</span>
        </a>
      </div>

      <div className="nwg-pdp-reviews__controls">
        <span>{summary.count} reviews</span>
        <span className="nwg-pdp-reviews__sort">
          <strong>Sort</strong>
          <span>Photos &amp; Videos</span>
          <svg aria-hidden="true" height="5" viewBox="0 0 10 5" width="10"><path d="m0 0 5 5 5-5Z" fill="currentColor" /></svg>
        </span>
      </div>

      <ul className="nwg-pdp-reviews__list">
        {summary.reviews.map((review) => (
          <Review key={review.dateCreated + review.reviewer.name} review={review} />
        ))}
      </ul>
    </section>
  );
}
