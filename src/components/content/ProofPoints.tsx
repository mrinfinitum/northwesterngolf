import Image from "next/image";
import Link from "next/link";
import { LOGO_URL } from "@/components/layout/Logo";
import { homepageContent } from "@/config/site";

/** Brand statement with three heritage milestones (homepage, between banners). */
export function ProofPoints() {
  const { body, eyebrow, heading, link, points } = homepageContent.proof;

  return (
    <section className="proof">
      <div className="proof__inner">
        <div className="proof__intro">
          <Image alt="Northwestern Golf" className="proof__logo" height={37} src={LOGO_URL} unoptimized width={426} />
          <p className="proof__eyebrow">{eyebrow}</p>
          <h2 className="proof__heading">{heading}</h2>
          <p className="proof__body">{body}</p>
          <Link className="proof__link" href={link.href}>{link.label}</Link>
        </div>
        <ol className="proof__list">
          {points.map((point) => (
            <li className="proof__item" key={point.label}>
              <p className="proof__value">{point.value}</p>
              <div className="proof__copy">
                <h3 className="proof__label">{point.label}</h3>
                <p className="proof__text">{point.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
