import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageScrollReset } from "@/components/commerce/ProductPageScrollReset";
import { PdpSections } from "@/components/product/PdpSections";
import { ProductMain } from "@/components/product/ProductMain";
import { getProductPageContent } from "@/lib/product-content";
import { getProduct } from "@/lib/shopify";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";
import { metadataTitle } from "@/lib/seo";
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
    openGraph: { description, images, title, type: "website", url: `/products/${product.handle}` },
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
  if (!product) notFound();

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
      availability: firstVariant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      price: firstVariant.price.amount,
      priceCurrency: firstVariant.price.currencyCode,
      url: `https://northwestern.golf/products/${product.handle}`,
    } : undefined,
    sku: firstVariant?.sku || undefined,
    url: `https://northwestern.golf/products/${product.handle}`,
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
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </div>
  );
}
