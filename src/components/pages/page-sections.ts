/**
 * Theme-only sections for Shopify Pages whose templates are built from custom
 * sections (the Page body is empty for all of these). Content and Shopify CDN
 * asset URLs were extracted from the live northwestern.golf markup; replace
 * with metaobjects once Admin/content API access exists. Keyed by page handle.
 */
const cdn = (file: string) => `https://cdn.shopify.com/s/files/1/0728/0869/3923/files/${file}`;

export type SectionImage = { alt: string; height: number; src: string; width: number };

export type PageSection =
  | {
      /** `other_page_banner_section`: dark photo banner with title, orange rule and intro text. */
      type: "banner";
      body: string;
      image: string;
      overlayOpacity: number;
      title: string;
      underlineColor: string;
    }
  | {
      /** `image_and_heading_text`: rounded portrait + heading + rich text paragraphs. */
      type: "legacy";
      image: SectionImage;
      paragraphsHtml: string[];
      title: string;
    }
  | {
      /** `text_with_icons`: bordered value cards on the beige band (bodies keep authored line breaks). */
      type: "values";
      heading?: string;
      items: Array<{ body: string; icon: string; title: string }>;
    }
  | {
      /** `home_image_with_text`: full-width linked image with mobile art direction. */
      type: "imageLink";
      desktop: SectionImage;
      href: string;
      mobile: SectionImage;
    }
  | {
      /** `image_with_text_overlay` (no text blocks): full-bleed image banner. */
      type: "imageBanner";
      desktop: SectionImage;
      mobile?: SectionImage;
      /** `auto` keeps the image ratio; `lg` uses the theme's fixed large height. */
      size: "auto" | "lg";
    }
  | {
      /** `three_image_banner_no_links`: three equal cover images. */
      type: "threeImages";
      images: SectionImage[];
    }
  | {
      /** `full_set_banner`: heading, intro and product tiles with "Shop Now" buttons. */
      type: "fullSetGrid";
      heading: string;
      introLead: string;
      intro: string;
      items: Array<{ href: string; image: SectionImage; title: string }>;
    }
  | {
      /** `brian_symonds_signature_wedges`: image + centered heading/body/CTA split. */
      type: "featureSplit";
      cta: { href: string; label: string };
      heading: string;
      image: SectionImage;
      paragraphs: string[];
      subheading: string;
    }
  | {
      /** `contact_info_section`: map, store details and the Shopify contact form. */
      type: "contact";
      address: string;
      addressHref: string;
      description: string;
      email: string;
      heading: string;
      hours: string;
      mapEmbed: string;
      phone: string;
      smallTitle: string;
    };

const headquarters = cdn("Northwestern20Bldg202-scaled.webp?v=1761208992");

export const pageSections: Record<string, PageSection[]> = {
  "our-story": [
    {
      type: "banner",
      body: "Since 1929, we’ve built clubs for real people — not just pros. Today, we carry that legacy forward with innovative, affordable gear for golfers of all ages, genders, and skill levels.",
      image: headquarters,
      overlayOpacity: 0.4,
      title: "Our Story",
      underlineColor: "#ff6600",
    },
    {
      type: "legacy",
      image: { alt: "Our Legacy, Reimagined", height: 1200, src: cdn("SB_00034.jpg?v=1765124541"), width: 800 },
      paragraphsHtml: [
        "<em>NORTHWESTERN</em> GOLF isn’t just a brand, it’s a legacy nearly 100 years in the making. Since 1929, we’ve believed that golf should be accessible, affordable, and enjoyable for everyone, not just the elite few. For decades, we outfitted millions of everyday players, becoming one of the most trusted and widely played names in the game.",
        "Today, we’re back with a fresh perspective, a modern product line, and the same mission that built our name: to deliver high-performance gear without the premium price tag. Designed by world-class engineer Jeff Sheets and built in the same factories trusted by leading brands, our clubs are made for real golfers; men, women, and seniors of every skill level.",
        "We don’t make equipment for show. We make it for the 80% of golfers who just want to play better, swing easier, and enjoy the game without breaking the bank.",
        "Whether you’re a first-timer, a weekend regular, or just someone who loves the game in jeans and a T-shirt — <em>NORTHWESTERN</em> GOLF is for you.",
      ],
      title: "Our Legacy, Reimagined",
    },
    {
      type: "values",
      heading: "Our Core Values",
      items: [
        { body: "We believe everyone deserves to play great golf — regardless of age, gender, skill level, or budget.\n\n", icon: cdn("002-access.webp?v=1761216782"), title: "Accessibility" },
        { body: "Our clubs are designed by leading engineers and built with real-game results in mind — forgiving, consistent, and confidence-boosting.", icon: cdn("001-golfing.webp?v=1761216859"), title: "Performance" },
        { body: "We deliver premium-quality gear without the premium price tag, because great equipment shouldn’t be out of reach.", icon: cdn("003-funding.webp?v=1761216949"), title: "Affordability" },
      ],
    },
    {
      type: "values",
      items: [
        { body: "From men and women to seniors and beginners, our products are made for all swings, all styles, and all players.", icon: cdn("004-inclusive.webp?v=1761219371"), title: "Inclusivity" },
        { body: "No elitism. No ego. Just honest gear for honest golfers — on public courses, in jeans, with friends.", icon: cdn("006-insurance.webp?v=1761219375"), title: "Authenticity" },
        { body: "We’re pushing the boundaries of innovation without breaking your wallet. Our patent pending technologies will help you hit it further and make playing more enjoyable.", icon: cdn("light-bulb.webp?v=1761219376"), title: "Innovation" },
      ],
    },
  ],
  contact: [
    {
      type: "banner",
      body: "Questions, feedback, or partnerships? We’d love to hear from you.",
      image: headquarters,
      overlayOpacity: 0.4,
      title: "Contact Us",
      underlineColor: "#ff6600",
    },
    {
      type: "contact",
      address: "300 N Madison St, Fortville, IN 46040, USA",
      addressHref: "https://maps.app.goo.gl/gonq4W2w9H4LRyR88",
      description: "Have a question or need support? We’re here to help—reach out anytime.",
      email: "info@northwestern.golf",
      heading: "Get in touch",
      hours: "08.00 - 16.00 EST",
      mapEmbed: "https://www.google.com/maps?q=300%20N%20Madison%20St,%20Fortville,%20IN%2046040,%20USA&output=embed",
      phone: "888-651-2295",
      smallTitle: "Customer service",
    },
  ],
  "talon-ss": [
    {
      type: "imageLink",
      desktop: { alt: "", height: 1019, src: cdn("Talon-SS-Homepage-1-2048x1019.webp?v=1761224238"), width: 2048 },
      href: "/collections/talon-ss-full-set",
      mobile: { alt: "", height: 1000, src: cdn("Talon-SS-Homepage-Mobile.webp?v=1761224339"), width: 800 },
    },
    {
      type: "imageBanner",
      desktop: { alt: "", height: 915, src: cdn("talon-banner-desktop-2048x915.webp?v=1761224982"), width: 2048 },
      mobile: { alt: "", height: 1350, src: cdn("talon-banner-mobile.webp?v=1761224984"), width: 1080 },
      size: "auto",
    },
    {
      type: "threeImages",
      images: [
        { alt: "Image 1", height: 1379, src: cdn("Photo-May-28-2025-11-46-17-AM-scaled.webp?v=1761225379"), width: 1200 },
        { alt: "Image 2", height: 1217, src: cdn("Photo-May-28-2025-11-42-00-AM-scaled.webp?v=1761225379"), width: 1200 },
        { alt: "Image 3", height: 1128, src: cdn("Photo-May-28-2025-12-16-55-PM-scaled.webp?v=1761225378"), width: 1200 },
      ],
    },
  ],
  "thunderbird-full-set": [
    {
      type: "imageBanner",
      desktop: { alt: "", height: 1066, src: cdn("FULL-SET.jpg?v=1761226702"), width: 1600 },
      size: "lg",
    },
    {
      type: "fullSetGrid",
      heading: "A Full Bag Without Emptying Yours",
      intro: " Thunderbird clubs merge timeless craftsmanship with advanced engineering. Each club incorporates over 25 precise mathematical calculations, including detailed center-of-gravity analyses, to deliver the “perfect club for the imperfect golfer.”",
      introLead: " NORTHWESTERN ",
      items: [
        { href: "/products/men-s-thunderbird-full-set", image: { alt: "Men’s Full Set – $949.99", height: 800, src: cdn("MENS-FULL-SET.webp?v=1761226702"), width: 800 }, title: "Men’s Full Set – $949.99" },
        { href: "/products/women-s-thunderbird-full-set", image: { alt: "Women’s Full Set – $999.99", height: 800, src: cdn("WOMENS_FULL_SET.webp?v=1761226700"), width: 800 }, title: "Women’s Full Set – $999.99" },
        { href: "/products/senior-s-thunderbird-full-set", image: { alt: "Seniors Full Set – $999.99", height: 800, src: cdn("SENIOR_FULL_SET.webp?v=1761226697"), width: 800 }, title: "Seniors Full Set – $999.99" },
      ],
    },
  ],
  wedges: [
    {
      type: "imageLink",
      desktop: { alt: "", height: 857, src: cdn("Wedge-Homepage.webp?v=1761233001"), width: 1920 },
      href: "/products/men-s-thunderbird-wedge",
      mobile: { alt: "", height: 1000, src: cdn("Wedge-Page-Banner-Mobile.jpg?v=1761233000"), width: 800 },
    },
    {
      type: "featureSplit",
      cta: { href: "/products/brian-symonds-classic-design-wedges", label: "Shop Now" },
      heading: "Brian Symonds",
      image: { alt: "", height: 788, src: cdn("brain-1.webp?v=1761235466"), width: 728 },
      paragraphs: [
        "The Brian Symonds Signature Wedges represent the pinnacle of short game performance, meticulously designed by renowned short-game instructor Brian Symonds.",
        "Brian’s journey into wedge design began under the mentorship of Bob Hamilton, the 1944 PGA Champion celebrated as one of the finest wedge players of his era on the PGA TOUR. A Class A member of the PGA of America for 34 years, Brian has served as a distinguished shortgame instructor on the PGA, LPGA, and Champions Tours.",
        "The Brian Symonds Signature Wedges feature higher bounce characteristics, allowing easier execution for golfers of all skill levels. Their timeless design and exceptional playability make them a trusted choice among players.",
      ],
      subheading: "Signature Wedges",
    },
    {
      type: "threeImages",
      images: [
        { alt: "Image 1", height: 1000, src: cdn("03.webp?v=1761234068"), width: 739 },
        { alt: "Image 2", height: 1500, src: cdn("05-1.webp?v=1761234070"), width: 1000 },
        { alt: "Image 3", height: 600, src: cdn("04.webp?v=1761234070"), width: 900 },
      ],
    },
  ],
};
