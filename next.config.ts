import type { NextConfig } from "next";

// Shopify customer accounts (new) for shop 72808693923; matches the live
// storefront's /account and /customer_authentication redirects.
const SHOPIFY_CUSTOMER_ACCOUNT_URL = "https://shopify.com/72808693923/account";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return ["/account", "/account/:path*", "/customer_authentication/:path*"].map((source) => ({
      destination: SHOPIFY_CUSTOMER_ACCOUNT_URL,
      permanent: false,
      source,
    }));
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
