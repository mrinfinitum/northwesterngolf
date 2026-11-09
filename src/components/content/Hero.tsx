import Link from "next/link";
import { homepageContent } from "@/config/site";

export function Hero() {
  const { buttonLabel, heading, href, video } = homepageContent.hero;

  return (
    <section className="home-hero">
      <video aria-hidden="true" autoPlay className="home-hero__video" loop muted playsInline preload="metadata">
        <source src={video} type="video/mp4" />
      </video>
      <div className="home-hero__content">
        <h1>{heading}</h1>
        <Link className="home-hero__button" href={href}>{buttonLabel}</Link>
      </div>
    </section>
  );
}
