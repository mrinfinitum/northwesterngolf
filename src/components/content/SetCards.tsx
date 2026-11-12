import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/components/commerce/Money";
import { PREORDER_SHIP_NOTE } from "@/config/promo";
import { isPreorderProduct } from "@/lib/preorder";
import type { SignatureSet } from "@/lib/signature-sets";
import "./set-cards.css";

/** Signature Set cards: image, uppercase name with price, note and "Shop now". */
export function SetCards({ sets }: { sets: SignatureSet[] }) {
  return (
    <ul className="set-cards">
      {sets.map(({ handle, label, note, product }) => {
        const image = product.featuredImage ?? product.images[0];
        return (
          <li className="set-card" key={handle}>
            <Link className="set-card__link" href={`/products/${handle}`}>
              <div className="set-card__media">
                {image ? (
                  <Image
                    alt={image.altText || product.title}
                    className="set-card__image"
                    fill
                    sizes="(max-width: 699px) 90vw, 33vw"
                    src={image.url}
                  />
                ) : null}
              </div>
              <div className="set-card__info">
                <h3 className="set-card__title">{label}</h3>
                <p className="set-card__note">{note}</p>
                <p className="set-card__price">
                  {formatMoney(product.priceRange.minVariantPrice)}
                  {Number(product.compareAtPriceRange.minVariantPrice.amount) > Number(product.priceRange.minVariantPrice.amount) ? (
                    <s className="set-card__compare">
                      <span className="sr-only">Regular price</span>
                      {formatMoney(product.compareAtPriceRange.minVariantPrice)}
                    </s>
                  ) : null}
                </p>
                {isPreorderProduct(product) ? <p className="set-card__preorder">Pre-order · {PREORDER_SHIP_NOTE}</p> : null}
                <span className="set-card__cta">{isPreorderProduct(product) ? "Pre-order now" : "Shop now"}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
