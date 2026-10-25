import Image from "next/image";
import { FeaturedCollection } from "@/components/content/FeaturedCollection";
import { Hero } from "@/components/content/Hero";
import { ImageOverlay } from "@/components/content/ImageOverlay";
import { Testimonials } from "@/components/content/Testimonials";
import { homepageContent } from "@/config/site";
import { getCollection, getProducts, type Product } from "@/lib/shopify";
import "./home.css";

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
          <Image alt={partnership.logoAlt} className="image-banner__logo" height={183} sizes="(max-width: 749px) 100vw, 546px" src={partnership.logo} width={1263} />
          <h2>{partnership.heading.replace(/\s+/g, " ")}</h2>
          <h3>{partnership.body}</h3>
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
