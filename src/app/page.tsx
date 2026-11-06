import type { Metadata } from "next";
import { openGraphBase } from "@/lib/seo";
import Image from "next/image";
import { FeaturedCollection } from "@/components/content/FeaturedCollection";
import { Hero } from "@/components/content/Hero";
import { ImageOverlay } from "@/components/content/ImageOverlay";
import { Testimonials } from "@/components/content/Testimonials";
import { homepageContent } from "@/config/site";
import { getCollection, getProducts, type Product } from "@/lib/shopify";
import "./home.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, url: "/" },
};

async function getFeaturedProducts(): Promise<Product[]> {
  const { collection, limit } = homepageContent.featured;
  try {
    const featured = await getCollection(collection, { first: limit });
    if (featured?.products.length) return featured.products;
    return await getProducts({ first: limit, sortKey: "BEST_SELLING" });
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const { campaign, featured, partnership } = homepageContent;

  return (
    <div className="home-page">
      <Hero />
      <ImageOverlay
        buttonLabel={partnership.buttonLabel}
        className="image-banner--partnership"
        href={partnership.href}
        image={partnership.image}
        imageSize={partnership.imageSize}
        mobileImage={partnership.mobileImage}
        mobileImageSize={partnership.mobileImageSize}
      >
        <div className="image-banner__intro">
          <Image alt={partnership.logoAlt} className="image-banner__logo" height={183} sizes="(max-width: 749px) 80vw, 420px" src={partnership.logo} width={1263} />
          {/* One line per beat: "Grip It." / "Rip It." / "Afford It." (last one accented). */}
          <h2 className="partnership__headline">
            {partnership.heading.split(/(?<=\.)\s+/).map((line, index, lines) => (
              <span className={index === lines.length - 1 ? "is-accent" : undefined} key={line}>{line}</span>
            ))}
          </h2>
          <p className="partnership__body">{partnership.body}</p>
        </div>
      </ImageOverlay>
      {products.length ? (
        <FeaturedCollection heading={featured.heading} href={featured.href} linkLabel={featured.linkLabel} products={products} />
      ) : null}
      <ImageOverlay
        buttonLabel={campaign.buttonLabel}
        className="image-banner--campaign"
        href={campaign.href}
        image={campaign.image}
        imageSize={campaign.imageSize}
        mobileImage={campaign.mobileImage}
        mobileImageSize={campaign.mobileImageSize}
      >
        <h2 className="image-banner__title">{campaign.heading}</h2>
      </ImageOverlay>
      <Testimonials />
    </div>
  );
}
