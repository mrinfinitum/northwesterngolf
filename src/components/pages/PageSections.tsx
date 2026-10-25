import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ContactSection } from "./ContactSection";
import type { PageSection, SectionImage } from "./page-sections";

/** `<picture>` with a separate mobile crop (theme breakpoint passed in). */
function ArtDirectedImage({
  className,
  desktop,
  mobile,
  mobileMaxWidth,
  priority = false,
}: {
  className?: string;
  desktop: SectionImage;
  mobile?: SectionImage;
  mobileMaxWidth: number;
  priority?: boolean;
}) {
  const common = { alt: desktop.alt, sizes: "100vw" };
  const { props: desktopProps } = getImageProps({ ...common, ...desktop, priority });
  const mobileSrcSet = mobile ? getImageProps({ ...common, ...mobile }).props.srcSet : undefined;
  return (
    <picture>
      {mobileSrcSet ? <source media={`(max-width: ${mobileMaxWidth}px)`} srcSet={mobileSrcSet} /> : null}
      <img {...desktopProps} alt={desktop.alt} className={className} />
    </picture>
  );
}

function Section({ contactPosted, first, section }: { contactPosted: boolean; first: boolean; section: PageSection }) {
  switch (section.type) {
    case "banner":
      return (
        <section className="nwg-page-banner">
          <Image alt="" className="nwg-page-banner__image" fill priority={first} sizes="100vw" src={section.image} />
          <div className="nwg-page-banner__overlay" style={{ opacity: section.overlayOpacity }} />
          <div className="nwg-page-banner__container">
            <div className="nwg-page-banner__left">
              <h1 className="nwg-page-banner__title">{section.title}</h1>
              <span className="nwg-page-banner__underline" style={{ backgroundColor: section.underlineColor }} />
            </div>
            <div className="nwg-page-banner__right">
              <p>{section.body}</p>
            </div>
          </div>
        </section>
      );
    case "legacy":
      return (
        <section className="nwg-page-legacy">
          <div className="nwg-page-legacy__container">
            <div className="nwg-page-legacy__image">
              <Image {...section.image} alt={section.image.alt} sizes="(min-width: 1000px) 400px, (min-width: 600px) 38vw, 100vw" />
            </div>
            <div className="nwg-page-legacy__content">
              <h2>{section.title}</h2>
              <div className="nwg-page-legacy__text">
                {section.paragraphsHtml.map((html) => <p dangerouslySetInnerHTML={{ __html: html }} key={html} />)}
              </div>
            </div>
          </div>
        </section>
      );
    case "values":
      return (
        <section className={`nwg-page-values${section.heading ? "" : " nwg-page-values--continued"}`}>
          {section.heading ? <h2 className="nwg-page-values__heading">{section.heading}</h2> : null}
          <div className="nwg-page-values__list">
            {section.items.map((item) => (
              <div className="nwg-page-values__item" key={item.title}>
                <Image alt="" height={92} src={item.icon} width={92} />
                <div>
                  <p className="nwg-page-values__title">{item.title}</p>
                  <p className="nwg-page-values__body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    case "imageLink":
      return (
        <div className="nwg-page-image-link">
          <Link href={section.href}>
            <ArtDirectedImage desktop={section.desktop} mobile={section.mobile} mobileMaxWidth={767} priority={first} />
          </Link>
        </div>
      );
    case "imageBanner":
      return (
        <section className={`nwg-page-image-banner nwg-page-image-banner--${section.size}`}>
          <ArtDirectedImage desktop={section.desktop} mobile={section.mobile} mobileMaxWidth={699} priority={first} />
        </section>
      );
    case "threeImages":
      return (
        <div className="nwg-page-three-images">
          {section.images.map((image) => (
            <div className="nwg-page-three-images__item" key={image.src}>
              <Image alt={image.alt} fill sizes="(max-width: 600px) 100vw, 34vw" src={image.src} />
            </div>
          ))}
        </div>
      );
    case "fullSetGrid":
      return (
        <section className="nwg-page-full-set">
          <div className="nwg-page-full-set__intro">
            <h2>{section.heading}</h2>
            <p>
              <em>{section.introLead}</em>
              {section.intro}
            </p>
          </div>
          <div className="nwg-page-full-set__grid">
            {section.items.map((item) => (
              <div className="nwg-page-full-set__item" key={item.href}>
                <Image {...item.image} alt={item.image.alt} sizes="(min-width: 1000px) 33vw, 100vw" />
                <div className="nwg-page-full-set__info">
                  <h3>{item.title}</h3>
                  <Link className="nwg-page-orange-button" href={item.href}>Shop Now</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    case "featureSplit":
      return (
        <section className="nwg-page-split">
          <div className="nwg-page-split__wrapper">
            <div className="nwg-page-split__image">
              <Image {...section.image} alt={section.image.alt} sizes="(min-width: 993px) 50vw, 100vw" />
            </div>
            <div className="nwg-page-split__text">
              <h2>{section.heading}</h2>
              <h3>{section.subheading}</h3>
              <div className="nwg-page-split__description">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <Link className="nwg-page-orange-button nwg-page-orange-button--lg" href={section.cta.href}>{section.cta.label}</Link>
            </div>
          </div>
        </section>
      );
    case "contact":
      return <ContactSection posted={contactPosted} section={section} />;
  }
}

export function PageSections({ contactPosted = false, sections }: { contactPosted?: boolean; sections: PageSection[] }) {
  return (
    <article className="nwg-page">
      {sections.map((section, index) => <Section contactPosted={contactPosted} first={index === 0} key={index} section={section} />)}
    </article>
  );
}
