/**
 * Static mirror of the Okendo reviews widget rendered on every live product
 * page. Live pins the widget to the Men's Thunderbird Full Set
 * (`shopify-8893055697059`), so all products show the same three reviews.
 *
 * No Okendo/Judge.me API credentials are available to this storefront; swap
 * `getProductReviews()` for a live widget or API call when they are.
 */

export type ProductReview = {
  body: string;
  dateCreated: string;
  helpful: { no: number; yes: number };
  rating: number;
  recommends: boolean;
  reviewer: { name: string; verified: boolean };
  title: string;
};

export type ProductReviewSummary = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  recommendPercent: number;
  reviews: ProductReview[];
  writeReviewUrl: string;
};

const OKENDO_REVIEWS: ProductReviewSummary = {
  average: 5,
  count: 3,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 3 },
  recommendPercent: 100,
  reviews: [
    {
      body: "Great looking, great feel. I have played 50 years with clubs from various brands. These northwestern clubs are as good if not better and the price was unbelievably affordable.  Happy Happy Happy",
      dateCreated: "2025-12-18T02:00:24.093Z",
      helpful: { no: 0, yes: 0 },
      rating: 5,
      recommends: true,
      reviewer: { name: "Clyde", verified: true },
      title: "Thunderbird set",
    },
    {
      body: "My dad used to rock a set back in the day and still have the clubs in my garage. The new clubs are fantastic - for the price you can’t beat it!",
      dateCreated: "2025-12-07T02:39:23.356Z",
      helpful: { no: 0, yes: 1 },
      rating: 5,
      recommends: true,
      reviewer: { name: "Travis", verified: true },
      title: "Pumped Northwestern is back!!",
    },
    {
      body: "For the price I had to give them a try but I was blown away by the performance. The wedges are incredible and I’m getting so much more distance with the irons. Very happy with my purchase.",
      dateCreated: "2025-12-07T02:36:44.684Z",
      helpful: { no: 0, yes: 2 },
      rating: 5,
      recommends: true,
      reviewer: { name: "George F.", verified: false },
      title: "Love these clubs!",
    },
  ],
  writeReviewUrl:
    "https://okendo.reviews/?subscriberId=16d46bae-43ff-4ec2-891b-0eef2577411c&productId=shopify-8893055697059&locale=en&okeChannel=reviews-widget-write-review-button",
};

export async function getProductReviews(handle: string): Promise<ProductReviewSummary> {
  void handle; // Live pins one review set to every product page.
  return OKENDO_REVIEWS;
}
