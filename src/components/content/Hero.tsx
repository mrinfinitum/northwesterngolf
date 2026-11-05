import Link from "next/link";
import { homepageContent } from "@/config/site";
import { HeroVideo } from "./HeroVideo";

/** Matches the `max-width: 749px` hero breakpoint in home.css. */
const MOBILE_MAX_WIDTH = 749;

export function Hero() {
  const { buttonLabel, heading, href, poster, video } = homepageContent.hero;

  return (
    <section className="home-hero">
      {/* Posters are pre-encoded WebP (first video frame), served as static
          files so the LCP never waits on the image optimizer. */}
      <picture>
        <source media={`(max-width: ${MOBILE_MAX_WIDTH}px)`} srcSet={poster.mobile.src} type="image/webp" />
        <img
          alt=""
          className="home-hero__poster"
          decoding="async"
          fetchPriority="high"
          height={poster.desktop.height}
          loading="eager"
          src={poster.desktop.src}
          width={poster.desktop.width}
        />
      </picture>
      <HeroVideo mobileMaxWidth={MOBILE_MAX_WIDTH} mobileSrc={video.mobile} src={video.desktop} />
      <div className="home-hero__content">
        <h1>{heading}</h1>
        <Link className="home-hero__button" href={href}>{buttonLabel}</Link>
      </div>
    </section>
  );
}
