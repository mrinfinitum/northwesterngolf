import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/config/site";
import "./globals.css";

const barlow = Barlow({
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow",
  // 400 and 700 match the live theme; 500 is for the header navigation.
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    </html>
  );
}
