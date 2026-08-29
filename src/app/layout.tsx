import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";
import "./premium.css";

const barlow = Barlow({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northwestern.golf"),
  title: {
    default: "Northwestern Golf",
    template: "%s | Northwestern Golf",
  },
  description:
    "Northwestern Golf creates performance golf equipment priced for the people.",
  alternates: { canonical: "/" },
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
