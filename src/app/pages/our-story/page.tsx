import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageSections, type PageSection } from "@/components/pages/page-sections";
import { metadataTitle, openGraphBase } from "@/lib/seo";
import "./our-story.css";

const description =
  "Since 1929, Northwestern Golf has built clubs for real golfers: high-performance gear without the premium price tag.";

export const metadata: Metadata = {
  title: metadataTitle("Our Story"),
  description,
  alternates: { canonical: "/pages/our-story" },
  openGraph: { ...openGraphBase, description, title: "Our Story · Northwestern Golf", url: "/pages/our-story" },
};

/** Hero photo (any landscape image; crop point in `focus`). */
const HERO = {
  alt: "John Daly with the Northwestern team and their Signature bags on the course",
  focus: "50% 40%",
  src: "/images/our-story/hero.jpg", // SB_00069, John Daly Shoot 10-31-25
};

const NUMBERS = [
  { label: "Building clubs", text: "Nearly 100 years of clubs for everyday golfers.", value: "1929" },
  { label: "America’s No. 1", text: "The largest golf club maker in the U.S., by units and by dollars.", value: "1978" },
  { label: "Of golfers", text: "The players we build for: the ones who just want to play better and enjoy the game.", value: "80%" },
];

type Legacy = Extract<PageSection, { type: "legacy" }>;
type Values = Extract<PageSection, { type: "values" }>;

export default function OurStoryPage() {
  const sections = pageSections["our-story"];
  const legacy = sections.find((section): section is Legacy => section.type === "legacy");
  const values = sections.filter((section): section is Values => section.type === "values").flatMap((section) => section.items);

  return (
    <article className="os">
      {/* Hero: white, centred SaaS-style header with the team photo below. */}
      <section className="os-hero">
        <div className="os-hero__content">
          <p className="os-eyebrow">Our Story · Since 1929</p>
          <h1 className="os-hero__title">Clubs for real golfers.</h1>
          <p className="os-hero__body">
            Since 1929, we’ve built clubs for real people, not just pros. Today we carry that legacy forward with innovative,
            affordable gear for golfers of all ages, genders and skill levels.
          </p>
          <div className="os-hero__actions">
            <Link className="os-button" href="/collections/all">Shop the collection</Link>
            <Link className="os-button os-button--ghost" href="/pages/john-daly">Meet John Daly</Link>
          </div>
        </div>
        <div className="os-hero__media">
          <Image alt={HERO.alt} className="os-hero__image" fill priority sizes="(max-width: 1400px) 100vw, 1320px" src={HERO.src} style={{ objectPosition: HERO.focus }} />
        </div>
      </section>

      {/* Mission statement. */}
      <section className="os-statement">
        <p className="os-statement__text">
          Golf should be <span>accessible</span>, <span>affordable</span> and <span>enjoyable</span> for everyone. Not just
          the elite few.
        </p>
      </section>

      {/* Legacy split. */}
      {legacy ? (
        <section className="os-legacy">
          <div className="os-legacy__inner">
            <div className="os-legacy__media">
              <Image alt={legacy.image.alt} className="os-legacy__image" fill sizes="(max-width: 899px) 100vw, 45vw" src={legacy.image.src} />
            </div>
            <div className="os-legacy__copy">
              <p className="os-eyebrow">The legacy</p>
              <h2 className="os-heading">{legacy.title}</h2>
              {legacy.paragraphsHtml.map((html) => (
                <p dangerouslySetInnerHTML={{ __html: html }} key={html} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Numbers on graphite. */}
      <section aria-label="Northwestern by the numbers" className="os-numbers">
        <ul className="os-numbers__list">
          {NUMBERS.map((item) => (
            <li className="os-numbers__item" key={item.value}>
              <p className="os-numbers__value">{item.value}</p>
              <h2 className="os-numbers__label">{item.label}</h2>
              <p className="os-numbers__text">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Core values, numbered. */}
      <section className="os-values">
        <div className="os-values__inner">
          <div className="os-values__intro">
            <p className="os-eyebrow">What we stand for</p>
            <h2 className="os-heading">Our core values</h2>
          </div>
          <ol className="os-values__list">
            {values.map((value) => (
              <li className="os-value" key={value.title}>
                <h3 className="os-value__title">{value.title}</h3>
                <p className="os-value__body">{value.body.trim()}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closer: one contained orange card. */}
      <section className="os-closer">
        <div className="os-closer__card">
          <div>
            <p className="os-closer__headline">Golf for everyone.</p>
            <p className="os-closer__body">First-timer, weekend regular, or just love the game in jeans and a T-shirt.</p>
          </div>
          <Link className="os-button" href="/collections/all">Shop the collection</Link>
        </div>
      </section>
    </article>
  );
}
