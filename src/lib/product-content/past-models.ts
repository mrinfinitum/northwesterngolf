/**
 * Discontinued Thunderbird and Talon SS models, shown on /pages/past-models.
 * The Shopify products are archived (not deleted), so the Storefront API no
 * longer returns them; titles and featured images are copied from the admin.
 */

const CDN = "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/";

export type PastModel = {
  handle: string;
  image: { height: number; src: string; width: number };
  title: string;
};

export type PastModelGroup = { heading: string; id: string; intro: string; models: PastModel[] };

const model = (handle: string, title: string, file: string, width = 2000, height = 2000): PastModel => ({
  handle,
  image: { height, src: CDN + file, width },
  title,
});

export const pastModelGroups: PastModelGroup[] = [
  {
    heading: "Thunderbird Full Sets",
    id: "thunderbird-full-sets",
    intro: "Complete Thunderbird sets for men, women and seniors.",
    models: [
      model("men-s-thunderbird-full-set", "Men’s Thunderbird Full Set", "Men_sThunderbirdFullSet1.webp?v=1760529996"),
      model("women-s-thunderbird-full-set", "Women’s Thunderbird Full Set", "Women_sThunderbirdFullSet1.jpg?v=1760532261", 1320, 1312),
      model("senior-s-thunderbird-full-set", "Senior’s Thunderbird Full Set", "Senior_sThunderbirdFullSet1.jpg?v=1760532899", 1320, 1312),
    ],
  },
  {
    heading: "Talon SS Full Sets",
    id: "talon-ss-full-sets",
    intro: "The Talon SS complete sets.",
    models: [
      model("men-s-talon-ss-full-set", "Men’s Talon SS Full Set", "3_1df04f21-26fe-4dfb-8942-d50a4e8195a4.png?v=1769794533", 3000, 3000),
      model("women-s-talon-ss-full-set", "Women’s Talon SS Full Set", "Women_sTalonSSFullSet9.jpg?v=1769812155", 1200, 1200),
      model("senior-s-talon-ss-full-set", "Senior’s Talon SS Full Set", "Senior_sTalonSSFullSet9.jpg?v=1769812559"),
    ],
  },
  {
    heading: "Thunderbird Clubs & Bag",
    id: "thunderbird-clubs",
    intro: "Individual Thunderbird drivers, fairways, hybrids, irons, wedges and the Thunderbird bag.",
    models: [
      model("men-s-thunderbird-driver", "Men’s Thunderbird Driver", "7_9412f2c0-9df4-481d-a6b8-5a662bae818a.png?v=1769805337", 3000, 3000),
      model("women-s-thunderbird-driver", "Women’s Thunderbird Driver", "Women_sThunderbirdDriver1.jpg?v=1760605819", 1320, 1312),
      model("senior-s-thunderbird-driver", "Senior’s Thunderbird Driver", "Senior_sThunderbirdDriver1.jpg?v=1760606558", 1320, 1312),
      model("men-s-thunderbird-fairway", "Men’s Thunderbird Fairway", "Sample_f3ac3683-65b2-40dd-bed5-085c0ab796cd.png?v=1770251292", 3000, 3000),
      model("women-s-thunderbird-fairway", "Women’s Thunderbird Fairway", "Women_sThunderbirdFairway1.jpg?v=1760548845"),
      model("senior-s-thunderbird-fairway", "Senior’s Thunderbird Fairway", "Senior_sThunderbirdFairway1.jpg?v=1760549160"),
      model("men-s-thunderbird-hybrid", "Men’s Thunderbird Hybrid", "Men_sThunderbirdHybrid1.webp?v=1760607017"),
      model("women-s-thunderbird-hybrids", "Women’s Thunderbird Hybrid", "Women_sThunderbirdHybrids1.webp?v=1760607978"),
      model("senior-s-thunderbird-hybrid", "Senior’s Thunderbird Hybrid", "Senior_sThunderbirdHybrid1.jpg?v=1760608618"),
      model("men-s-thunderbird-irons-set", "Men’s Thunderbird Irons Set", "Men_sThunderbirdIronsSet1.webp?v=1760533407"),
      model("women-s-thunderbird-irons-set", "Women’s Thunderbird Irons Set", "Women_sThunderbirdIronsSet1.jpg?v=1760534191"),
      model("senior-s-thunderbird-irons-set", "Senior’s Thunderbird Irons Set", "Senior_sThunderbirdIronsSet1.webp?v=1760534887"),
      model("men-s-thunderbird-wedge", "Men’s Thunderbird Wedge", "Men_sThunderbirdWedge2.webp?v=1765992571"),
      model("thunderbird-golf-bag", "Thunderbird Golf Bag", "ThunderbirdGolfBag.webp?v=1760611136", 1356, 1652),
    ],
  },
];

/** Old product URLs that should land on the showcase instead of a 404. */
export const pastModelHandles = new Set([
  ...pastModelGroups.flatMap((group) => group.models.map((entry) => entry.handle)),
  "men-s-thunderbird-full-set-rental-sets",
]);
