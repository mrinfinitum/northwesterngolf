import Link from "next/link";
import { homepageContent } from "@/config/site";

export function Hero() {
  return (
    <section className="home-hero">
      <video
        aria-hidden="true"
        autoPlay
        className="home-hero__video"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={homepageContent.hero.video} type="video/mp4" />
      </video>
      <div className="home-hero__content">
        <h2>{homepageContent.hero.heading}</h2>
        <p>{homepageContent.hero.subheading}</p>
        <Link className="button button--campaign button--hero" href={homepageContent.hero.href}>Shop now</Link>
      </div>
    </section>
  );
}
