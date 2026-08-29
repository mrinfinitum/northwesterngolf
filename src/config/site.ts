export type NavigationItem = {
  href: string;
  label: string;
  children?: Array<{ href: string; label: string }>;
};

export const primaryNavigation: NavigationItem[] = [
  {
    href: "/pages/talon-ss",
    label: "Talon SS",
    children: [
      { href: "/products/men-s-talon-ss-full-set", label: "Men’s Talon SS Full Set" },
      { href: "/products/women-s-talon-ss-full-set", label: "Women’s Talon SS Full Set" },
      { href: "/products/senior-s-talon-ss-full-set", label: "Senior’s Talon SS Full Set" },
    ],
  },
  {
    href: "/pages/thunderbird-full-set",
    label: "Thunderbird",
    children: [
      { href: "/products/men-s-thunderbird-full-set", label: "Men’s Thunderbird Full Set" },
      { href: "/products/women-s-thunderbird-full-set", label: "Women’s Thunderbird Full Set" },
      { href: "/products/senior-s-thunderbird-full-set", label: "Senior’s Thunderbird Full Set" },
    ],
  },
  {
    href: "/collections/irons",
    label: "Irons",
    children: [
      { href: "/products/men-s-thunderbird-irons-set", label: "Men’s Thunderbird Irons Set" },
      { href: "/products/women-s-thunderbird-irons-set", label: "Women’s Thunderbird Irons Set" },
      { href: "/products/senior-s-thunderbird-irons-set", label: "Senior’s Thunderbird Irons Set" },
    ],
  },
  {
    href: "/collections/fairways",
    label: "Woods",
    children: [
      { href: "/products/men-s-thunderbird-fairway", label: "Men’s Thunderbird Fairway" },
      { href: "/products/women-s-thunderbird-fairway", label: "Women’s Thunderbird Fairway" },
      { href: "/products/senior-s-thunderbird-fairway", label: "Senior’s Thunderbird Fairway" },
    ],
  },
  {
    href: "/collections/drivers",
    label: "Driver",
    children: [
      { href: "/products/men-s-thunderbird-driver", label: "Men’s Thunderbird Driver" },
      { href: "/products/women-s-thunderbird-driver", label: "Women’s Thunderbird Driver" },
      { href: "/products/senior-s-thunderbird-driver", label: "Senior’s Thunderbird Driver" },
    ],
  },
  {
    href: "/collections/hybrids",
    label: "Hybrids",
    children: [
      { href: "/products/men-s-thunderbird-hybrid", label: "Men’s Thunderbird Hybrid" },
      { href: "/products/women-s-thunderbird-hybrids", label: "Women’s Thunderbird Hybrids" },
      { href: "/products/senior-s-thunderbird-hybrid", label: "Senior’s Thunderbird Hybrid" },
    ],
  },
  {
    href: "/pages/wedges",
    label: "Wedges",
    children: [
      { href: "/products/men-s-thunderbird-wedge", label: "Men’s Thunderbird Wedge" },
    ],
  },
  { href: "/products/thunderbird-golf-bag", label: "Golf Bags" },
];

export const footerGroups = [
  {
    heading: "About Us",
    links: [
      { href: "/pages/our-story", label: "Our Story" },
      { href: "/pages/contact", label: "Contact" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { href: "/collections/talon-ss-full-set", label: "Talon SS Full Set" },
      { href: "/collections/thunderbird-full-set", label: "Thunderbird Full Set" },
      { href: "/collections/irons", label: "Irons" },
      { href: "/collections/fairways", label: "Fairways" },
      { href: "/collections/drivers", label: "Drivers" },
      { href: "/collections/hybrids", label: "Hybrids" },
      { href: "/collections/wedges", label: "Wedges" },
      { href: "/collections/golf-bags", label: "Golf Bags" },
    ],
  },
  {
    heading: "Information",
    links: [
      { href: "/policies/refund-policy", label: "Return Policy" },
      { href: "/policies/privacy-policy", label: "Privacy Policy" },
      { href: "/policies/terms-of-service", label: "Terms & Conditions" },
    ],
  },
] as const;

/**
 * Theme-only homepage content, isolated so it can be replaced by exported
 * section data/metaobjects without touching the page components.
 */
export const homepageContent = {
  announcement: "Sitewide Sale: Take 30% Off All Products",
  intro: {
    accent: "100 years",
    eyebrow: "Northwestern Golf · Since 1929",
    heading: "A legacy nearly 100 years in the making.",
    href: "/pages/our-story",
    linkLabel: "Discover our story",
    subheading: "High-performance golf equipment built for real people — not just pros.",
  },
  hero: {
    heading: "The Legacy Lives On.",
    href: "/collections/all",
    subheading: "Built for performance, priced for the people.",
    video:
      "https://northwestern.golf/cdn/shop/videos/c/vp/2d3f1e1bc08d494f99ff915b5c39bb09/2d3f1e1bc08d494f99ff915b5c39bb09.HD-1080p-4.8Mbps-64572144.mp4?v=0",
  },
  partnership: {
    eyebrow: "John Daly × Northwestern",
    heading: "Grip It. Rip It.\nAfford It.",
    body: "Built for performance, priced for the people.",
    href: "/collections/all",
    image:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/daly-shot.jpg?v=1764889357",
    mobileImage:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/nwxdaly-m-top.jpg?v=1764906675",
    logo: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/nwxjd.png?v=1764816230",
  },
  campaign: {
    eyebrow: "John Daly × Northwestern Golf",
    heading: "Send it like Daly.",
    href: "/products/men-s-thunderbird-driver",
    image:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/daly-swing-soft-focus.jpg?v=1765125870",
    mobileImage:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/daly-swing-closeup-m2.jpg?v=1765076356",
    subheading: "John Daly attitude. Northwestern clubs. Priced for the people. Performance like the pros.",
  },
} as const;

/**
 * Approved theme-owned Our Story content. This stays isolated from Shopify Page
 * body data until the custom sections have a structured Shopify content model.
 */
export const ourStoryContent = {
  hero: {
    body: "Since 1929, we’ve built clubs for real people — not just pros. Today, we carry that legacy forward with innovative, affordable gear for golfers of all ages, genders, and skill levels.",
    image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/Northwestern20Bldg202-scaled.webp?v=1761208992",
    title: "Our Story",
  },
  legacy: {
    image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/SB_00034.jpg?v=1765124541",
    paragraphs: [
      "NORTHWESTERN GOLF isn’t just a brand, it’s a legacy nearly 100 years in the making. Since 1929, we’ve believed that golf should be accessible, affordable, and enjoyable for everyone, not just the elite few. For decades, we outfitted millions of everyday players, becoming one of the most trusted and widely played names in the game.",
      "Today, we’re back with a fresh perspective, a modern product line, and the same mission that built our name: to deliver high-performance gear without the premium price tag. Designed by world-class engineer Jeff Sheets and built in the same factories trusted by leading brands, our clubs are made for real golfers; men, women, and seniors of every skill level.",
      "We don’t make equipment for show. We make it for the 80% of golfers who just want to play better, swing easier, and enjoy the game without breaking the bank.",
      "Whether you’re a first-timer, a weekend regular, or just someone who loves the game in jeans and a T-shirt — NORTHWESTERN GOLF is for you.",
    ],
    title: "Our Legacy, Reimagined",
  },
  valueGroups: [
    [
      {
        body: "We believe everyone deserves to play great golf — regardless of age, gender, skill level, or budget.",
        image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/002-access.webp?v=1761216782",
        title: "Accessibility",
      },
      {
        body: "Our clubs are designed by leading engineers and built with real-game results in mind — forgiving, consistent, and confidence-boosting.",
        image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/001-golfing.webp?v=1761216859",
        title: "Performance",
      },
      {
        body: "We deliver premium-quality gear without the premium price tag, because great equipment shouldn’t be out of reach.",
        image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/003-funding.webp?v=1761216949",
        title: "Affordability",
      },
    ],
    [
      {
        body: "From men and women to seniors and beginners, our products are made for all swings, all styles, and all players.",
        image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/004-inclusive.webp?v=1761219371",
        title: "Inclusivity",
      },
      {
        body: "No elitism. No ego. Just honest gear for honest golfers — on public courses, in jeans, with friends.",
        image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/006-insurance.webp?v=1761219375",
        title: "Authenticity",
      },
      {
        body: "We’re pushing the boundaries of innovation without breaking your wallet. Our patent pending technologies will help you hit it further and make playing more enjoyable.",
        image: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/light-bulb.webp?v=1761219376",
        title: "Innovation",
      },
    ],
  ],
} as const;

export const testimonials = [
  {
    author: "David P",
    quote:
      "I used to play only major manufacturer's products. I switched to Northwestern clubs and I experience the same—or better—results with Northwestern clubs at 50-75% the cost!",
  },
  {
    author: "Michelle P",
    quote:
      "I hit the ball straighter, higher, and farther than what I played previously. Result—I score better!",
  },
  {
    author: "Holly G",
    quote:
      "I purchased a full set of Northwestern Thunderbird clubs and I LOVE them! They are so easy to hit compared to what I was playing before. 5 stars!",
  },
  {
    author: "Rick B",
    quote:
      "I could not hit a 3-wood high enough from the fairway to get effective carry and distance. The new Northwestern 3HL lets me finally hit a 3 wood from the fairway!",
  },
  {
    author: "Mike K",
    quote:
      "Finally, a company has created high-quality, affordable equipment! Thank you, Northwestern!",
  },
  {
    author: "Jake H",
    quote:
      "I am playing the Northwestern wedges and they have replaced my $200 wedges in my bag. They are amazingly solid!",
  },
  {
    author: "Steve P",
    quote:
      "I absolutely love my new Thunderbird irons! I am one club longer, and I love the feel. The 5 hybrid is the best hybrid that I have ever hit!",
  },
  {
    author: "Brian P",
    quote:
      "I bought a full set of Thunderbird clubs and I love them! The irons are the best set of irons that I have ever owned.",
  },
  {
    author: "Verified Customer",
    quote:
      "I tried the 6HL fairway wood in place of a hybrid and I have never hit an easier fairway wood. Perfect for my 210 distance.",
  },
] as const;
