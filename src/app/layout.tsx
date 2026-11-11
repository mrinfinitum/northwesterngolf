import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Barlow } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/config/site";
import "./globals.css";

/** Northwestern Golf GA4 property (also used by the Shopify Google & YouTube channel at checkout). */
const GA_MEASUREMENT_ID = "G-T04EQ37VVZ";
/** Only the production deployment reports to GA, so local and preview traffic stays out of the data. */
const isProduction = process.env.VERCEL_ENV === "production";

const barlow = Barlow({
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow",
  // Matches the live theme, which only ships Barlow 400 and 700.
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Google Search Console token carried over from the Shopify theme so the existing property stays verified.
  verification: { google: "wLqi7euXlFlDl5Mya7GEWBaUAvHOteY6_saJvnYqcoA" },
  title: {
    default: "Northwestern Golf",
    template: "%s | Northwestern Golf",
  },
  description:
    "Northwestern Golf creates performance golf equipment priced for the people.",
  // No canonical here: it would be inherited by every route that doesn't set
  // its own (cart, 404s), pointing them all at the homepage.
  openGraph: {
    locale: "en_US",
    siteName: "Northwestern Golf",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
      {isProduction ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
    </html>
  );
}
