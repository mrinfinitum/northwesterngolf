/** Canonical storefront origin (no trailing slash). The apex redirects here. */
export const siteUrl = "https://www.northwestern.golf";

export type NavigationLink = { href: string; label: string };

/** A top-level navigation entry. `href` is absent for Shopify `#` placeholder links. */
export type NavigationItem = {
  children?: NavigationLink[];
  href?: string;
  label: string;
};

export type FooterGroup = { heading: string; links: NavigationLink[] };

/**
 * Static fallbacks for the Shopify `main-menu`, `footer`, `collections`, and
 * `information` menus. The live menus are loaded from the Storefront API.
 */
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
    label: "Irons",
    children: [
      { href: "/products/men-s-thunderbird-irons-set", label: "Men’s Thunderbird Irons Set" },
      { href: "/products/women-s-thunderbird-irons-set", label: "Women’s Thunderbird Irons Set" },
      { href: "/products/senior-s-thunderbird-irons-set", label: "Senior’s Thunderbird Irons Set" },
    ],
  },
  {
    label: "Woods",
    children: [
      { href: "/products/men-s-thunderbird-fairway", label: "Men’s Thunderbird Fairway" },
      { href: "/products/women-s-thunderbird-fairway", label: "Women’s Thunderbird Fairway" },
      { href: "/products/senior-s-thunderbird-fairway", label: "Senior’s Thunderbird Fairway" },
    ],
  },
  {
    label: "Driver",
    children: [
      { href: "/products/men-s-thunderbird-driver", label: "Men’s Thunderbird Driver" },
      { href: "/products/women-s-thunderbird-driver", label: "Women’s Thunderbird Driver" },
      { href: "/products/senior-s-thunderbird-driver", label: "Senior’s Thunderbird Driver" },
    ],
  },
  {
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

export const footerGroups: FooterGroup[] = [
  {
    heading: "About Us",
    links: [
      { href: "/pages/our-story", label: "About Us" },
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
];

/** Shopify menu handles backing the footer columns, in display order. */
export const footerMenuHandles = ["footer", "collections", "information"] as const;

export const socialLinks = [
  { href: "https://www.facebook.com/people/Northwestern-Golf/61577748907586/", label: "Facebook", network: "facebook" },
  { href: "https://www.instagram.com/northwestern.golf", label: "Instagram", network: "instagram" },
  { href: "https://www.tiktok.com/@northwesterngolfclubs", label: "TikTok", network: "tiktok" },
] as const;

/**
 * Wholesale Gorilla app pages. The live theme serves them with `noindex` and
 * omits them from the sitemap; their app UI only runs inside the Shopify theme.
 */
export const noindexPageHandles = new Set([
  "wholesale-registration-form",
  "ws-account-create",
  "ws-account-login",
  "ws-cart",
  "ws-proxy",
  "ws-quick-order-form",
]);

/** Redirects to Shopify customer accounts (see next.config.ts). */
export const accountUrl = "/account";

/**
 * Theme-only homepage content extracted from the live Impact theme sections
 * (video hero, image-with-text overlays, featured collection, review scroller).
 */
export const homepageContent = {
  hero: {
    buttonLabel: "SHOP NOW",
    heading: "THE LEGACY LIVES ON.",
    href: "/collections/all",
    // Encoded from "Northwestern- WebsiteVideo-Nov26.mp4": H.264, no audio,
    // faststart. Mobile is a centre crop matching the portrait hero.
    poster: {
      desktop: { height: 1080, src: "/video/hero-poster.webp", width: 1920 },
      mobile: { height: 864, src: "/video/hero-poster-mobile.webp", width: 540 },
    },
    video: {
      desktop: "/video/hero-1080.mp4",
      mobile: "/video/hero-mobile.mp4",
    },
  },
  partnership: {
    body: "Built for performance, priced for the people.",
    buttonLabel: "Shop Clubs",
    heading: "Grip It. Rip It.\nAfford It.",
    href: "/collections/all",
    image:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/daly-shot.jpg?v=1764889357",
    imageSize: { height: 1000, width: 2000 },
    logo: "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/nwxjd.png?v=1764816230",
    logoAlt: "John Daly X Northwestern",
    mobileImage:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/nwxdaly-m-top.jpg?v=1764906675",
    mobileImageSize: { height: 1438, width: 975 },
  },
  featured: {
    collection: "mens-collection",
    heading: "Full Collection",
    href: "/collections/mens-collection",
    linkLabel: "View all",
    limit: 6,
  },
  // Split feature: copy on the left, framed image on the right. Swap the
  // photo by changing `image` (any aspect; it is cropped to 4:3 around `focus`).
  // Copy is from the Men's Thunderbird Driver product page.
  campaign: {
    body: "Engineered to help you hit the longest, straightest drives of your life. A classic shape with modern, high-launch technology. Stop fixing your slice. Start splitting fairways.",
    buttonLabel: "Shop clubs",
    eyebrow: "Thunderbird Titanium Driver",
    heading: "Send it like Daly.",
    href: "/collections/all",
    image: {
      alt: "Northwestern Thunderbird driver with John Daly's signature, held out by Daly",
      focus: "50% 36%",
      height: 2400,
      src: "/images/daly-driver.jpg",
      width: 1600,
    },
    specs: ["Aerospace-grade titanium face", "Deep, low CG for high launch", "Speedflex shaft"],
    subheading: "Unleash the thunder.",
    /** "dark" (ink) or "light" (warm grey). */
    theme: "dark" as "dark" | "light",
  },
  // Every claim here is sourced from existing site copy (Our Story, the
  // Wedges page). 1978: Chicago Golf Report, "Northwestern Golf Company: Golf
  // Clubs For The Masses" (largest manufacturer in both units and dollars).
  proof: {
    body: "We started building clubs for everyday golfers nearly 100 years ago. We still do: modern designs, honest prices, and a guarantee behind every set.",
    eyebrow: "Making golf easier since 1929",
    heading: "Clubs for real golfers. Not just pros.",
    link: { href: "/pages/our-story", label: "Our story" },
    points: [
      { label: "Heritage", text: "For decades, one of the most widely played golf brands in America.", value: "1929" },
      { label: "Wedge lineage", text: "Brian Symonds Signature Wedges, shaped under 1944 PGA Champion Bob Hamilton.", value: "1944" },
      { label: "America’s No. 1", text: "The largest golf club maker in the U.S., by units and by dollars.", value: "1978" },
    ],
  },
  reviews: {
    eyebrow: "Customer Reviews",
    heading: "Golfers Are Talking",
    subheading: "Real feedback from players who choose Northwestern Golf.",
  },
} as const;

/**
 * Approved theme-owned Our Story content. This stays isolated from Shopify Page
 * body data until the custom sections have a structured Shopify content model.
 */
export const testimonials = [
  {
    author: "David P",
    quote:
      "I used to play only major manufacturer's products. I switched to Northwestern clubs and I experience the same - or better - results with Northwestern clubs at 50-75% the cost!",
  },
  {
    author: "Michelle P",
    quote:
      "I have more fun playing Northwestern clubs! I hit the ball straighter, higher, and farther than what I played previously! Result - I score better!",
  },
  {
    author: "Rick B",
    quote:
      "I could not hit a 3-wood high enough from the fairway to get effective carry and distance. I tried the new Northwestern 3HL 3 wood and I can finally hit a 3 wood from the fairway! Thank-you, Northwestern!",
  },
  {
    author: "Holly G",
    quote:
      "I purchased a full set of Northwestern Thunderbird clubs and I LOVE them! They are so easy to hit compared to what I was playing before. 5 stars!",
  },
  {
    author: "Mike K",
    quote:
      "Finally, a company has created high-quality price affordable equipment! Thank you, Northwestern!",
  },
  {
    author: "Jake H",
    quote:
      "I am playing the Northwestern wedges and they have replaced my $200 wedges in my bag! They are amazingly solid and only $79.99!",
  },
  {
    author: "Steve P",
    quote:
      "I absolutely love my new Thunderbird irons! I am one club longer, and I love the feel! The 5 hybrid is the best hybrid that I have ever hit!",
  },
  {
    author: "Brian P",
    quote:
      "I bought a full set of Thunderbird clubs and I love them! The irons are the best set of irons that I have ever owned.",
  },
  {
    author: "Verified Customer",
    quote:
      "I tried the 6HL fairway wood in place of a hybrid and I have never hit an easier fairway wood! Perfect for my 210 distance. I highly recommend this club!",
  },
] as const;
