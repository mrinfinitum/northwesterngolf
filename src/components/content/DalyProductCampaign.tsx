import Image from "next/image";
import Link from "next/link";
import { homepageContent } from "@/config/site";

export function DalyProductCampaign() {
  return (
    <section className="daly-product-campaign">
      <Image
        alt="John Daly for Northwestern Golf"
        className="daly-product-campaign__image"
        fill
        sizes="100vw"
        src={homepageContent.partnership.image}
      />
      <div className="daly-product-campaign__shade" />
      <div className="daly-product-campaign__content">
        <p>Northwestern Golf × John Daly</p>
        <h2>DALY<br />CLUBS</h2>
        <span>{homepageContent.partnership.heading}</span>
        <Link className="button daly-product-campaign__cta" href={homepageContent.partnership.href}>
          Shop now
        </Link>
      </div>
    </section>
  );
}
