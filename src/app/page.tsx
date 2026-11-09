import type { Metadata } from "next";
import { openGraphBase } from "@/lib/seo";
import Image from "next/image";
import { Hero } from "@/components/content/Hero";
import { ImageOverlay } from "@/components/content/ImageOverlay";
import { Testimonials } from "@/components/content/Testimonials";
import { homepageContent } from "@/config/site";
import "./home.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, url: "/" },
};

export default function Home() {
  // The "Most Wanted" product row is hidden on production.
  const { campaign, partnership } = homepageContent;

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
