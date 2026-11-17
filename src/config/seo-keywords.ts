/**
 * Search titles and descriptions aimed at the queries people use for these sets.
 * Primary: "John Daly golf clubs" (Search Console's top non-brand query).
 * Secondary: "John Daly golf club set", "junior golf club set ages 5-8 / 9-12",
 * "complete golf set". These win over the Shopify product SEO fields, so they can
 * be tuned here without editing products in Shopify.
 */
export const productSeo: Record<string, { description: string; title: string }> = {
  "junior-john-daly-signature-set-ages-5-8": {
    description:
      "John Daly junior golf club set for ages 5-8: a complete, right- or left-handed kids set with a stand bag. 30-day returns, 1-year warranty.",
    title: "John Daly Junior Golf Club Set, Ages 5-8",
  },
  "junior-john-daly-signature-set-ages-9-12": {
    description:
      "John Daly junior golf club set for ages 9-12: a complete, right- or left-handed set with a stand bag. 30-day returns, 1-year warranty.",
    title: "John Daly Junior Golf Club Set, Ages 9-12",
  },
  "mens-john-daly-signature-set": {
    description:
      "The John Daly men's complete golf club set: driver, 3- and 5-wood, 5-PW irons, sand wedge and putter with a stand bag. Stiff or Regular flex.",
    title: "John Daly Golf Clubs: Men's Complete Set | Northwestern Golf",
  },
};

export const HOME_TITLE = "John Daly Golf Clubs | Signature Sets by Northwestern Golf";
export const HOME_DESCRIPTION =
  "Shop John Daly golf clubs: complete Signature golf club sets for men and juniors, each with a matching stand bag. 30-day returns and a 1-year warranty.";
