import type { Metadata } from "next";
import { openGraphBase } from "@/lib/seo";
import Image from "next/image";
import { ClubSlider, type ClubSlide } from "@/components/content/ClubSlider";
import { formatMoney } from "@/components/commerce/Money";
import { FeatureSplit } from "@/components/content/FeatureSplit";
import { Hero } from "@/components/content/Hero";
import { ImageOverlay } from "@/components/content/ImageOverlay";
import { ProofPoints } from "@/components/content/ProofPoints";
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

/** Tags that describe audience or channel rather than the club itself. */
const NON_CATEGORY_TAGS = new Set(["men", "women", "senior", "seniors", "retail", "wholesale"]);
const SERIES = ["Talon SS", "Thunderbird"];

/** "Thunderbird · Irons" from tags like ["Irons", "Men", "Thunderbird"]. */
function clubEyebrow(tags: string[]) {
  const series = SERIES.find((name) => tags.some((tag) => tag.toLowerCase() === name.toLowerCase()));
  const category = tags.find(
    (tag) => !NON_CATEGORY_TAGS.has(tag.toLowerCase()) && !SERIES.some((name) => name.toLowerCase() === tag.toLowerCase()),
  );
  return [series, category].filter(Boolean).join(" · ") || undefined;
}

function toSlide(product: Product): ClubSlide {
  const image = product.featuredImage ?? product.images[0];
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.maxVariantPrice;
  const priceVaries = Number(product.priceRange.maxVariantPrice.amount) > Number(price.amount);
  return {
    compareAtPrice: Number(compareAt.amount) > Number(price.amount) ? formatMoney(compareAt) : undefined,
    eyebrow: clubEyebrow(product.tags),
    handle: product.handle,
    image: image
      ? { alt: image.altText || product.title, height: image.height ?? 1000, url: image.url, width: image.width ?? 1000 }
      : undefined,
    price: `${priceVaries ? "From " : ""}${formatMoney(price)}`,
    soldOut: !product.availableForSale,
    title: product.title,
  };
}

export default async function Home() {
  const products = await getFeaturedProducts();
  const { featured, partnership } = homepageContent;

  return (
    <div className="home-page">
      <Hero />
      {products.length ? (
        <ClubSlider heading={featured.heading} href={featured.href} linkLabel={featured.linkLabel} slides={products.map(toSlide)} />
      ) : null}
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
      <ProofPoints />
      <FeatureSplit />
      <Testimonials />
    </div>
  );
}
