import { FeaturedCollection } from "@/components/content/FeaturedCollection";
import { Hero } from "@/components/content/Hero";
import { HomeIntro } from "@/components/content/HomeIntro";
import { ImageOverlay } from "@/components/content/ImageOverlay";
import { Testimonials } from "@/components/content/Testimonials";
import { homepageContent } from "@/config/site";
import { getProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await getProducts({ first: 6, sortKey: "BEST_SELLING" });

  return (
    <div className="home-page">
      <Hero />
      <HomeIntro />
      <ImageOverlay
        body={homepageContent.partnership.body}
        heading={homepageContent.partnership.heading}
        href={homepageContent.partnership.href}
        image={homepageContent.partnership.image}
        mobileImage={homepageContent.partnership.mobileImage}
        logo={homepageContent.partnership.logo}
      />
      <FeaturedCollection products={products} />
      <ImageOverlay
        body={homepageContent.campaign.subheading}
        buttonLabel="Explore the driver"
        ctaTone="orange"
        eyebrow={homepageContent.campaign.eyebrow}
        heading={homepageContent.campaign.heading}
        href={homepageContent.campaign.href}
        image={homepageContent.campaign.image}
        mobileImage={homepageContent.campaign.mobileImage}
        vertical="center"
      />
      <Testimonials />
    </div>
  );
}
