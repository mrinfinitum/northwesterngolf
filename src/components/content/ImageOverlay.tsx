import { getImageProps } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Size = { height: number; width: number };

/**
 * Full-bleed image banner with overlaid copy (Impact "image with text overlay").
 * The banner height follows the image's aspect ratio, swapping to a portrait
 * crop below 700px.
 */
export function ImageOverlay({
  buttonLabel,
  children,
  className,
  href,
  image,
  imageSize,
  mobileImage,
  mobileImageSize,
}: {
  buttonLabel: string;
  children: ReactNode;
  className?: string;
  href: string;
  image: string;
  imageSize: Size;
  mobileImage: string;
  mobileImageSize: Size;
}) {
  const common = { alt: "", sizes: "100vw" };
  const { props: { srcSet: mobileSrcSet } } = getImageProps({ ...common, ...mobileImageSize, src: mobileImage });
  const { props: { alt, ...desktopProps } } = getImageProps({ ...common, ...imageSize, src: image });

  return (
    <section className={`image-banner${className ? ` ${className}` : ""}`}>
      <picture>
        <source media="(max-width: 699px)" srcSet={mobileSrcSet} />
        <img {...desktopProps} alt={alt} className="image-banner__image" />
      </picture>
      <div className="image-banner__content">
        <div className="image-banner__prose">
          {children}
          <Link className="image-banner__button" href={href}>{buttonLabel}</Link>
        </div>
      </div>
    </section>
  );
}
