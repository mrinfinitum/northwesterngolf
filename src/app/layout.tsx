import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Barlow } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/config/site";
import { GOOGLE_TAG_ID } from "@/lib/analytics";
import { defaultShareImage, openGraphBase } from "@/lib/seo";
import "./globals.css";

// Only production reports to Google Analytics; previews (dev.northwestern.golf) stay out of the data.
const isProduction = process.env.VERCEL_ENV === "production";

const barlow = Barlow({
  display: "swap",
  // No italic files: the CSS never sets italic, and the odd <em> in Shopify content is
  // slanted by the browser. Halves the font preloads every page waits on (10 → 5).
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-barlow",
  // 400 and 700 match the live theme; 500 for contact details, 600 for the header navigation, 800 for promo headlines.
  weight: ["400", "500", "600", "700", "800"],
});

// Preview builds of the dev branch resolve share images against dev.northwestern.golf,
// so link previews there show files that only exist on the new site. Production uses www.
const metadataOrigin =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "dev"
    ? "https://dev.northwestern.golf"
    : siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin),
  // Google Search Console token carried over from the Shopify theme so the existing property stays verified.
  verification: { google: "wLqi7euXlFlDl5Mya7GEWBaUAvHOteY6_saJvnYqcoA" },
  title: {
    default: "Northwestern Golf",
    template: "%s | Northwestern Golf",
  },
  description:
    "John Daly Signature golf club sets from Northwestern Golf: complete men's and junior sets with a matching stand bag, priced for the people.",
  // No canonical here: it would be inherited by every route that doesn't set
  // its own (cart, 404s), pointing them all at the homepage.
  openGraph: openGraphBase,
  twitter: { card: "summary_large_image", images: [defaultShareImage.url] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={barlow.variable} lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
      {isProduction ? <GoogleAnalytics gaId={GOOGLE_TAG_ID} /> : null}
    </html>
  );
}
