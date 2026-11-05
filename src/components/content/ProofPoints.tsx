import Link from "next/link";
import { homepageContent } from "@/config/site";

/** Brand statement with four numbered proof points (homepage, between banners). */
export function ProofPoints() {
  const { body, eyebrow, heading, link, points } = homepageContent.proof;

  return (
    <section className="proof">
      <div className="proof__inner">
        <div className="proof__intro">
          <p className="proof__eyebrow">{eyebrow}</p>
          <h2 className="proof__heading">{heading}</h2>
          <p className="proof__body">{body}</p>
          <Link className="proof__link" href={link.href}>{link.label}</Link>
        </div>
        <ol className="proof__list">
          {points.map((point) => (
            <li className="proof__item" key={point.label}>
              <p className="proof__value">
                {point.value}
                {"unit" in point ? <span className="proof__unit">{point.unit}</span> : null}
              </p>
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
