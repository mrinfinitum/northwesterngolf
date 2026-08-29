import Image from "next/image";
import Link from "next/link";

export function ImageOverlay({
  body,
  heading,
  href,
  image,
  logo,
  mobileImage,
  buttonLabel = "Shop clubs",
  ctaTone = "light",
  eyebrow,
  position = "left",
  vertical = "top",
}: {
  body?: string;
  heading: string;
  href: string;
  image: string;
  logo?: string;
  mobileImage?: string;
  buttonLabel?: string;
  ctaTone?: "light" | "orange";
  eyebrow?: string;
  position?: "left" | "right";
  vertical?: "top" | "center";
}) {
  return (
    <section className={`image-overlay image-overlay--${position} image-overlay--${vertical} image-overlay--${ctaTone}-cta${logo ? " image-overlay--branded" : ""}`}>
      <Image alt="" className="image-overlay__background image-overlay__background--desktop" fill sizes="100vw" src={image} />
      {mobileImage ? (
        <Image alt="" className="image-overlay__background image-overlay__background--mobile" fill sizes="100vw" src={mobileImage} />
      ) : null}
      <div className="image-overlay__shade" />
      <div className="image-overlay__content">
        {logo ? <Image alt="John Daly × Northwestern Golf" className="image-overlay__logo" height={90} src={logo} width={360} /> : null}
        {eyebrow ? <p className="image-overlay__eyebrow">{eyebrow}</p> : null}
        <h2>{heading}</h2>
        {body ? <p className="image-overlay__subheading">{body}</p> : null}
        <Link className="button button--light" href={href}>{buttonLabel}</Link>
      </div>
    </section>
  );
}
