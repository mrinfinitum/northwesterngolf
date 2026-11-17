import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ProductPageScrollReset } from "@/components/commerce/ProductPageScrollReset";
import { PdpSections } from "@/components/product/PdpSections";
import { SHIPPING } from "@/config/shipping";
import { siteUrl } from "@/config/site";
import { ProductMain } from "@/components/product/ProductMain";
import { getProductPageContent } from "@/lib/product-content";
import { getProduct } from "@/lib/shopify";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";
import { jsonLdScript, metadataTitle, openGraphBase } from "@/lib/seo";
import "./product-page.css";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Pick<ProductPageProps, "params">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };

  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description.slice(0, 160);
  const images = product.featuredImage ? [{ alt: product.featuredImage.altText || product.title, url: product.featuredImage.url }] : [];

  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: { ...openGraphBase, description, images, title, url: `/products/${product.handle}` },
    twitter: { card: "summary_large_image", description, images: images.map((image) => image.url), title },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { handle } = await params;
  const [product, content, query] = await Promise.all([
    getProduct(handle),
    getProductPageContent(handle),
    searchParams,
  ]);
  if (!product) {
    // Old (archived or deleted) products all send shoppers to the current sets.
    permanentRedirect("/collections/all");
  }

  const requestedVariant = typeof query.variant === "string" ? query.variant : undefined;
  const firstVariant = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: { "@type": "Brand", name: product.vendor || "Northwestern Golf" },
    description: product.description,
    image: product.images.map((image) => image.url),
    name: product.title,
    offers: firstVariant ? {
      "@type": "Offer",
      availability: !firstVariant.availableForSale
        ? "https://schema.org/OutOfStock"
        : firstVariant.currentlyNotInStock
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      // From /policies/refund-policy: 30 days, by mail, buyer pays return shipping.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        merchantReturnDays: 30,
        merchantReturnLink: `${siteUrl}/policies/refund-policy`,
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        returnMethod: "https://schema.org/ReturnByMail",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      },
      price: firstVariant.price.amount,
      priceCurrency: firstVariant.price.currencyCode,
      // From src/config/shipping.ts (Shopify's only zone is the United States).
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: SHIPPING.country },
        shippingRate: { "@type": "MonetaryAmount", currency: "USD", value: SHIPPING.standardPrice },
      },
      url: `${siteUrl}/products/${product.handle}`,
    } : undefined,
    sku: firstVariant?.sku || undefined,
    url: `${siteUrl}/products/${product.handle}`,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", item: siteUrl, name: "Home", position: 1 },
      { "@type": "ListItem", item: `${siteUrl}/collections/all`, name: "Shop Clubs", position: 2 },
      { "@type": "ListItem", item: `${siteUrl}/products/${product.handle}`, name: product.title, position: 3 },
    ],
  };

  return (
    <div className="nwg-pdp" data-template={content.id}>
      <ProductPageScrollReset productHandle={product.handle} />
      <ProductMain
        cartEnabled={isRetailCartEnabled()}
        info={content.info}
        initialVariantId={requestedVariant}
        key={product.handle}
        product={product}
      />
      <PdpSections handle={product.handle} sections={content.sections} />
      <script dangerouslySetInnerHTML={jsonLdScript([productJsonLd, breadcrumbJsonLd])} type="application/ld+json" />
    </div>
  );
}
