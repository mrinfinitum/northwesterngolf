import type { NextConfig } from "next";
import { legacyRedirects } from "./src/config/legacy-redirects";

// Shopify customer accounts (new) for shop 72808693923, served on its primary
// customer accounts domain (shopify.com/72808693923/account redirects here).
const SHOPIFY_CUSTOMER_ACCOUNT_URL = "https://account.northwestern.golf/";

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";

// Shopify serves product images and Instafeed serves Instagram media. Forms post to
// this site, except the fallback contact form, which posts to Shopify's primary domain.
const SHOPIFY_FORM_ORIGIN = "https://checkout.northwestern.golf";
const MEDIA_ORIGINS = "https://cdn.shopify.com https://*.cdninstagram.com https://*.fbcdn.net";
// The Vercel toolbar is injected on preview deployments only.
const VERCEL_TOOLBAR = isPreview ? " https://vercel.live https://*.vercel.live" : "";

// Google tag GT-5R3QNQJ8 (GA4 + the Google Ads destination Shopify's Google & YouTube
// app adds). Origins from Google's CSP guide for GA4 and Google Ads:
// https://developers.google.com/tag-platform/security/guides/csp
const GOOGLE_SCRIPT = " https://*.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com";
const GOOGLE_IMG = " https://*.google-analytics.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com";
const GOOGLE_CONNECT = " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://pagead2.googlesyndication.com";
const GOOGLE_FRAME = "https://td.doubleclick.net https://www.googletagmanager.com";

// Static rendering is kept, so scripts use 'unsafe-inline' rather than per-request
// nonces (Next.js "Without Nonces" CSP); everything else is locked to known origins.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${GOOGLE_SCRIPT}${VERCEL_TOOLBAR}`,
  `style-src 'self' 'unsafe-inline'${VERCEL_TOOLBAR}`,
  `img-src 'self' data: blob: ${MEDIA_ORIGINS}${GOOGLE_IMG}${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
  `media-src 'self' ${MEDIA_ORIGINS}`,
  `font-src 'self'${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${GOOGLE_CONNECT}${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}${isDev ? " ws:" : ""}`,
  `frame-src ${GOOGLE_FRAME}${isPreview ? " https://vercel.live" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' ${SHOPIFY_FORM_ORIGIN}`,
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    const headers = [...securityHeaders];
    // Keep preview builds (dev.northwestern.golf) out of search results.
    if (isPreview) headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    return [{ headers, source: "/:path*" }];
  },
  async redirects() {
    const account = ["/account", "/account/:path*", "/customer_authentication/:path*"].map((source) => ({
      destination: SHOPIFY_CUSTOMER_ACCOUNT_URL,
      permanent: false,
      source,
    }));
    return [...account, ...legacyRedirects];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "northwestern.golf",
        pathname: "/cdn/shop/**",
      },
    ],
  },
};

export default nextConfig;
