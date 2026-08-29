import Link from "next/link";
import { homepageContent } from "@/config/site";

export function HomeIntro() {
  const { accent, eyebrow, heading, href, linkLabel, subheading } = homepageContent.intro;
  const [headingLead, headingTail] = heading.split(accent);

  return (
    <section className="home-intro">
      <div className="home-intro__content">
        <p className="home-intro__eyebrow">{eyebrow}</p>
        <h1>
          {headingLead}<span>{accent}</span>{headingTail}
        </h1>
        <p className="home-intro__subheading">{subheading}</p>
        <Link className="button button--primary home-intro__cta" href={href}>
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
