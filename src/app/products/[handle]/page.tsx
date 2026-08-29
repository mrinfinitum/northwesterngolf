import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/commerce/Breadcrumbs";
import { DalyProductEditorial } from "@/components/commerce/DalyProductEditorial";
import { DalyProductRail } from "@/components/commerce/DalyProductRail";
import { ProductConfigurator } from "@/components/commerce/ProductConfigurator";
import { DalyProductCampaign } from "@/components/content/DalyProductCampaign";
import { getProduct, getProducts } from "@/lib/shopify";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";
import { metadataTitle } from "@/lib/seo";
import "./daly-product.css";

type ProductPageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const isDalyDesignPrototype = handle === "men-s-thunderbird-driver";
  const relatedProducts = isDalyDesignPrototype
    ? (await getProducts({ first: 9 })).filter((item) => item.id !== product.id).slice(0, 7)
    : [];

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
    <div className={`product-page${isDalyDesignPrototype ? " daly-product-page" : ""}`}>
      <div className="product-page__inner page-shell page-shell--wide">
        <Breadcrumbs current={product.title} />
        <ProductConfigurator
          brandLine={isDalyDesignPrototype ? "Northwestern Golf × John Daly" : undefined}
          campaignLabel={isDalyDesignPrototype ? "Daly Clubs" : undefined}
          cartEnabled={isRetailCartEnabled()}
          product={product}
        />
        {!isDalyDesignPrototype && product.descriptionHtml ? (
          <section className="product-description rich-text">
            <h2>Product details</h2>
            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          </section>
        ) : null}
      </div>
      {isDalyDesignPrototype ? (
        <>
          <DalyProductEditorial product={product} />
          <DalyProductRail products={relatedProducts} />
          <DalyProductCampaign />
        </>
      ) : null}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </div>
  );
}
