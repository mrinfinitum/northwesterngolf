import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/components/commerce/Money";
import { getProducts, type Product } from "@/lib/shopify";
import { metadataTitle, openGraphBase } from "@/lib/seo";
import "./john-daly.css";

const description =
  "Two-time major champion John Daly and Northwestern Golf: the John Daly Signature Sets for men and juniors. Grip it. Rip it. Afford it.";

export const metadata: Metadata = {
  title: metadataTitle("John Daly"),
  description,
  alternates: { canonical: "/pages/john-daly" },
  openGraph: { ...openGraphBase, description, title: "John Daly × Northwestern Golf", url: "/pages/john-daly" },
};

/** The Signature Sets in display order, with the label used on this page. */
const SETS = [
  { handle: "mens-john-daly-signature-set", label: "Men’s Set", note: "Stiff or Regular flex" },
  { handle: "junior-john-daly-signature-set-ages-9-12", label: "Junior Set · Ages 9-12", note: "Right or left hand" },
  { handle: "junior-john-daly-signature-set-ages-5-8", label: "Junior Set · Ages 5-8", note: "Right or left hand" },
];

const STATS = [
  { label: "Major championships", text: "1991 PGA Championship and 1995 Open Championship", value: "2" },
  { label: "PGA Tour wins", text: "Plus a PGA Tour Champions title in 2017", value: "5" },
  { label: "Yards, on average", text: "First player to average over 300 yards off the tee for a season", value: "300+" },
  { label: "Distance titles", text: "Seasons he led the PGA Tour in driving distance", value: "11×" },
];

const MILESTONES = [
  { label: "PGA Championship", text: "Ninth alternate to major champion at Crooked Stick, Indiana, in his rookie season.", year: "1991" },
  { label: "The Open Championship", text: "Claret Jug at St Andrews, after a four-hole playoff with Costantino Rocca.", year: "1995" },
  { label: "The 300 club", text: "The first PGA Tour player to average more than 300 yards off the tee over a season.", year: "1997" },
  { label: "PGA Tour Champions", text: "Won the Insperity Invitational for his first senior title.", year: "2017" },
];

async function getSets(): Promise<Array<(typeof SETS)[number] & { product: Product }>> {
  try {
    const products = await getProducts({ first: 20, query: "title:*Daly*" });
    return SETS.flatMap((set) => {
      const product = products.find((item) => item.handle === set.handle);
      return product ? [{ ...set, product }] : [];
    });
  } catch {
    return [];
  }
}

export default async function JohnDalyPage() {
  const sets = await getSets();

  return (
    <article className="jd">
      {/* Hero: full-bleed swing at Doral, headline over the sky and lake. */}
      <section className="jd-hero">
        <Image
          alt="John Daly at the top of his backswing at Doral, with his Signature Set bag"
          className="jd-hero__image"
          fill
          priority
          sizes="100vw"
          src="/images/daly/jd-hero.jpg"
        />
        <div className="jd-hero__content">
          <p className="jd-eyebrow">John Daly × Northwestern Golf</p>
          <h1 className="jd-hero__headline">
            <span className="jd-sr">John Daly: </span>
            <span>Grip It.</span>
            <span>Rip It.</span>
          </h1>
          <span aria-hidden="true" className="jd-signature jd-hero__signature" />
          <p className="jd-hero__body">
            Two-time major champion. The longest hitter of his generation. Golf’s favorite everyman has put his name on a set
            of clubs anyone can afford.
          </p>
          <div className="jd-hero__actions">
            <Link className="jd-button" href="#sets">Shop the sets</Link>
            <Link className="jd-button jd-button--ghost" href="#story">His story</Link>
          </div>
        </div>
      </section>

      {/* Career numbers on graphite. */}
      <section aria-label="John Daly by the numbers" className="jd-stats">
        <ul className="jd-stats__list">
          {STATS.map((stat) => (
            <li className="jd-stats__item" key={stat.label}>
              <p className="jd-stats__value">{stat.value}</p>
              <h2 className="jd-stats__label">{stat.label}</h2>
              <p className="jd-stats__text">{stat.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 1991: the ninth alternate. */}
      <section className="jd-story" id="story">
        <div className="jd-story__inner">
          <div className="jd-story__copy">
            <p className="jd-eyebrow">August 1991 · Crooked Stick, Indiana</p>
            <h2 className="jd-heading">The ninth alternate</h2>
            <p>
              He wasn’t supposed to be there. John Daly was the ninth and final alternate for the 1991 PGA Championship, and
              the call came the night before the first round. He drove through the night, borrowed Nick Price’s caddie, and
              teed it up without a practice round.
            </p>
            <p>
              Then he overpowered the place. Four days later the 25-year-old rookie was a major champion, and golf had a new
              folk hero: a big swing, no airs, and a gallery that felt like he was one of them.
            </p>
            <p className="jd-story__aside">
              Crooked Stick sits just up the road from Fortville, Indiana, where Northwestern has built clubs for everyday
              golfers since 1929.
            </p>
          </div>
          <div className="jd-story__media">
            <Image
              alt="John Daly coiled at the top of his backswing"
              className="jd-story__image"
              fill
              sizes="(max-width: 899px) 100vw, 55vw"
              src="/images/daly/jd-1991.jpg"
            />
          </div>
        </div>
      </section>

      {/* Career timeline in the brand orange and blue. */}
      <section className="jd-timeline">
        <div className="jd-timeline__inner">
          <div className="jd-timeline__intro">
            <p className="jd-eyebrow">The career</p>
            <h2 className="jd-heading">Long John, by the years</h2>
          </div>
          <ol className="jd-timeline__list">
            {MILESTONES.map((milestone) => (
              <li className="jd-timeline__item" key={milestone.year}>
                <p className="jd-timeline__year">{milestone.year}</p>
                <div>
                  <h3 className="jd-timeline__label">{milestone.label}</h3>
                  <p className="jd-timeline__text">{milestone.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The partnership: signature driver, dark split. */}
      <section className="jd-signature-split">
        <div className="jd-signature-split__inner">
          <div className="jd-signature-split__media">
            <Image
              alt="The John Daly Signature driver, with his signature on the crown"
              className="jd-signature-split__image"
              fill
              sizes="(max-width: 899px) 100vw, 45vw"
              src="/images/daly/jd-signature-driver.jpg"
            />
          </div>
          <div className="jd-signature-split__copy">
            <p className="jd-eyebrow">The Signature Sets</p>
            <h2 className="jd-heading jd-signature-split__heading">
              His name on every club
              <span aria-hidden="true" className="jd-signature jd-signature-split__tag" />
            </h2>
            <p>
              Daly has always played golf for everybody. No pretense, just a big swing and a good time. His Signature Sets are
              built the same way: a complete, matched set engineered by Northwestern, with a stand bag and headcovers, and
              priced so anyone can tee it up.
            </p>
            <ul className="jd-specs">
              <li>Complete matched set, ready to play</li>
              <li>Stand bag and headcovers included</li>
              <li>Men’s, Junior 9-12 and Junior 5-8</li>
            </ul>
            <Link className="jd-button" href="#sets">Find your set</Link>
          </div>
        </div>
      </section>

      {/* The three sets, live from Shopify. */}
      {sets.length ? (
        <section className="jd-sets" id="sets">
          <div className="jd-sets__intro">
            <p className="jd-eyebrow">Shop</p>
            <h2 className="jd-heading">Pick your set</h2>
          </div>
          <ul className="jd-sets__grid">
            {sets.map(({ handle, label, note, product }) => {
              const image = product.featuredImage ?? product.images[0];
              const price = product.priceRange.minVariantPrice;
              return (
                <li className="jd-set" key={handle}>
                  <Link className="jd-set__link" href={`/products/${handle}`}>
                    <div className="jd-set__media">
                      {image ? (
                        <Image
                          alt={image.altText || product.title}
                          className="jd-set__image"
                          fill
                          sizes="(max-width: 699px) 90vw, 33vw"
                          src={image.url}
                        />
                      ) : null}
                    </div>
                    <div className="jd-set__info">
                      <h3 className="jd-set__title">{label}</h3>
                      <p className="jd-set__note">{note}</p>
                      <p className="jd-set__price">{formatMoney(price)}</p>
                      <span className="jd-set__cta">Shop now</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Photo mosaic from the shoots. */}
      <section aria-label="John Daly with Northwestern Golf" className="jd-gallery">
        <div className="jd-gallery__item jd-gallery__item--tall">
          <Image alt="John Daly holding his Signature driver" fill sizes="(max-width: 699px) 100vw, 33vw" src="/images/daly/jd-portrait-driver.jpg" />
        </div>
        <div className="jd-gallery__item jd-gallery__item--wide">
          <Image alt="John Daly swinging at Doral, Signature bag beside him" fill sizes="(max-width: 699px) 100vw, 66vw" src="/images/daly/jd-doral-swing.jpg" />
        </div>
        <div className="jd-gallery__item">
          <Image alt="John Daly with the Men’s and Junior Signature Set bags" fill sizes="(max-width: 699px) 100vw, 33vw" src="/images/daly/bags.jpg" />
        </div>
        <div className="jd-gallery__item">
          <Image alt="John Daly with his Signature putter" fill sizes="(max-width: 699px) 100vw, 33vw" src="/images/daly/jd-putter.jpg" />
        </div>
      </section>

      {/* Closing call to action. */}
      <section className="jd-closer">
        <p className="jd-closer__headline">
          <span>Grip It.</span>
          <span>Rip It.</span>
          <span className="is-accent">Afford It.</span>
        </p>
        <Link className="jd-button" href="#sets">Shop the Signature Sets</Link>
      </section>
    </article>
  );
}
