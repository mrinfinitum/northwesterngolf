import { homepageContent, testimonials } from "@/config/site";
import type { ProductReview } from "@/lib/product-content/reviews";
import { ReviewSlider } from "@/components/product/ReviewSlider";

/** Homepage reviews: the same centred card slider as the product pages. */
const REVIEWS: ProductReview[] = testimonials.map((testimonial) => ({
  body: testimonial.quote,
  dateCreated: "",
  helpful: { no: 0, yes: 0 },
  rating: 5,
  recommends: true,
  reviewer: { name: testimonial.author, verified: false },
  title: "",
}));

export function Testimonials() {
  const { eyebrow, heading, subheading } = homepageContent.reviews;

  return (
    <section className="nwg-pdp-reviews">
      <div className="nwg-pdp-reviews__header">
        <p className="nwg-pdp-reviews__eyebrow">{eyebrow}</p>
        <h2 className="nwg-pdp-reviews__heading">{heading}</h2>
        <p className="nwg-pdp-reviews__summary">{subheading}</p>
      </div>
      <ReviewSlider reviews={REVIEWS} />
    </section>
  );
}
