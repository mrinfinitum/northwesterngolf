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

function Review({ review }: { review: ProductReview }) {
  return (
    <li className="nwg-pdp-reviews__item">
      <article className="nwg-pdp-review">
        <div className="nwg-pdp-review__top">
          <Stars rating={review.rating} size="md" />
          <time className="nwg-pdp-review__date" dateTime={review.dateCreated}>{relativeDate(review.dateCreated)}</time>
        </div>
        <h3 className="nwg-pdp-review__title">{review.title}</h3>
        <p className="nwg-pdp-review__body">{review.body}</p>
        <p className="nwg-pdp-review__byline">
          {review.reviewer.name}
          {review.reviewer.verified ? <span className="nwg-pdp-review__verified"> · Verified buyer</span> : null}
        </p>
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

  return (
    <section aria-label={`Rated ${summary.average.toFixed(1)} out of 5 stars, based on ${summary.count} reviews`} className="nwg-pdp-reviews" id="nwg-pdp-reviews">
      <div className="nwg-pdp-reviews__header">
        <div>
          <p className="nwg-pdp-reviews__eyebrow">Reviews</p>
          <h2 className="nwg-pdp-reviews__heading">What golfers say</h2>
        </div>
        <div className="nwg-pdp-reviews__score">
          <span className="nwg-pdp-reviews__average">{summary.average.toFixed(1)}</span>
          <div className="nwg-pdp-reviews__meta">
            <Stars rating={summary.average} size="lg" />
            <span>
              {summary.count} reviews · {summary.recommendPercent}% would recommend
            </span>
            <a className="nwg-pdp-reviews__write" href={summary.writeReviewUrl} rel="noopener noreferrer" target="_blank">
              Write a review<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <ul className="nwg-pdp-reviews__list">
        {summary.reviews.map((review) => (
          <Review key={review.dateCreated + review.reviewer.name} review={review} />
        ))}
      </ul>
    </section>
  );
}
