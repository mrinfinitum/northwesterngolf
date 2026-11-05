import Image from "next/image";
import Link from "next/link";
import { homepageContent } from "@/config/site";

/** Homepage product feature: copy on the left, framed image on the right. */
export function FeatureSplit() {
  const { body, buttonLabel, eyebrow, heading, href, image, specs, subheading, theme } = homepageContent.campaign;

  return (
    <section className={`feature-split${theme === "light" ? " feature-split--light" : ""}`}>
      <div className="feature-split__inner">
        <div className="feature-split__copy">
          <p className="feature-split__eyebrow">{eyebrow}</p>
          <h2 className="feature-split__heading">{heading}</h2>
          <p className="feature-split__subheading">{subheading}</p>
          <p className="feature-split__body">{body}</p>
          <ul className="feature-split__specs">
            {specs.map((spec) => <li key={spec}>{spec}</li>)}
          </ul>
          <Link className="feature-split__cta" href={href}>{buttonLabel}</Link>
        </div>
        <div className="feature-split__media">
          <Image
            alt={image.alt}
            className="feature-split__image"
            fill
            sizes="(max-width: 899px) 100vw, 60vw"
            src={image.src}
            style={{ objectPosition: image.focus }}
          />
        </div>
      </div>
    </section>
  );
}
