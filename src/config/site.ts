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
    href: "/collections/all",
    label: "Shop Clubs",
    children: [
      { href: "/products/junior-john-daly-signature-set-ages-5-8", label: "Junior Set – Ages 5-8" },
      { href: "/products/junior-john-daly-signature-set-ages-9-12", label: "Junior Set – Ages 9-12" },
      { href: "/products/mens-john-daly-signature-set", label: "Men’s Signature Set" },
    ],
  },
  { href: "/pages/john-daly", label: "John Daly" },
  { href: "/pages/our-story", label: "About Us" },
  { href: "/pages/contact", label: "Contact" },
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
      { href: "/products/junior-john-daly-signature-set-ages-5-8", label: "Junior Set – Ages 5-8" },
      { href: "/products/junior-john-daly-signature-set-ages-9-12", label: "Junior Set – Ages 9-12" },
      { href: "/products/mens-john-daly-signature-set", label: "Men’s Signature Set" },
      { href: "/collections/all", label: "Shop All" },
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
    logo: "/images/nw-x-daly.png", // Wordmark × header brush X × signature
    logoAlt: "John Daly X Northwestern",
    mobileImage:
      "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/nwxdaly-m-top.jpg?v=1764906675",
    mobileImageSize: { height: 1438, width: 975 },
  },
  featured: {
    collection: "mens-collection",
    heading: "Shop the Collection",
    href: "/collections/all",
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
  // Claims are sourced from existing site copy (Our Story) and the John Daly
  // partnership. 1978: Chicago Golf Report, "Northwestern Golf Company: Golf
  // Clubs For The Masses" (largest manufacturer in both units and dollars).
  proof: {
    body: "We started building clubs for everyday golfers nearly 100 years ago. We still do: modern designs, honest prices, and a guarantee behind every set.",
    eyebrow: "Making golf easier since 1929",
    heading: "Clubs for real golfers. Not just pros.",
    link: { href: "/pages/our-story", label: "Our story" },
    points: [
      { label: "Heritage", text: "For decades, one of the most widely played golf brands in America.", value: "1929" },
      { label: "America’s No. 1", text: "The largest golf club maker in the U.S., by units and by dollars.", value: "1978" },
      { label: "John Daly joins the team", text: "The two-time major champion and the people’s golfer releases his signature line of clubs.", value: "2026" },
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
// Brand-level quotes only: ones naming discontinued lines (Thunderbird, wedges,
// 3HL/6HL woods) were dropped since those products are no longer sold.
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
    author: "Mike K",
    quote:
      "Finally, a company has created high-quality price affordable equipment! Thank you, Northwestern!",
  },
] as const;
