import { getProductReviews, type ProductReview } from "@/lib/product-content/reviews";
import { StarIcon } from "./icons";
import { ReviewSlider } from "./ReviewSlider";

function Stars({ rating, size }: { rating: number; size: "lg" | "md" }) {
  return (
    <span aria-label={`Rated ${rating.toFixed(size === "lg" ? 1 : 0)} out of 5 stars`} className={`nwg-pdp-reviews__stars is-${size}`} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon className={index < Math.round(rating) ? "is-filled" : undefined} key={index} />
      ))}
    </span>
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
        <p className="nwg-pdp-reviews__eyebrow">Reviews</p>
        <h2 className="nwg-pdp-reviews__heading">Don’t just take our word for it</h2>
        <p className="nwg-pdp-reviews__summary">
          <Stars rating={summary.average} size="md" />
          <span><strong>{summary.average.toFixed(1)}</strong> out of 5 from {summary.count} reviews</span>
        </p>
      </div>
      <ReviewSlider reviews={summary.reviews} />
      <p className="nwg-pdp-reviews__write-wrap">
        <a className="nwg-pdp-reviews__write" href={summary.writeReviewUrl} rel="noopener noreferrer" target="_blank">
          Write a review<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
