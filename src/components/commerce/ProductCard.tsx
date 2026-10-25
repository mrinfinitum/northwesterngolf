import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import { formatMoney } from "./Money";

const SIZES = "(max-width: 699px) calc(50vw - 24px), (max-width: 1199px) calc(50vw - 44px), 470px";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const href = `/products/${product.handle}`;
  const image = product.featuredImage ?? product.images[0];
  const secondaryImage = product.images.find((candidate) => candidate.id !== image?.id);
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const compareAt = product.compareAtPriceRange.maxVariantPrice;
  const onSale = Number(compareAt.amount) > Number(price.amount);
  const priceVaries = Number(maxPrice.amount) > Number(price.amount);
  const savings = Number(compareAt.amount) - Number(price.amount);

  return (
    <article className="product-card">
      {!product.availableForSale ? (
        <span className="product-card__badge product-card__badge--sold-out">Sold out</span>
      ) : onSale ? (
        <span className="product-card__badge product-card__badge--sale">
          Save {formatMoney({ amount: savings.toFixed(2), currencyCode: price.currencyCode })}
        </span>
      ) : null}
      <Link className="product-card__figure" href={href} tabIndex={-1}>
        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              className="product-card__image product-card__image--primary"
              height={image.height ?? 1000}
              loading={priority ? "eager" : undefined}
              sizes={SIZES}
              src={image.url}
              width={image.width ?? 1000}
            />
            {secondaryImage ? (
              <Image
                alt=""
                aria-hidden="true"
                className="product-card__image product-card__image--secondary"
                height={secondaryImage.height ?? 1000}
                sizes={SIZES}
                src={secondaryImage.url}
                width={secondaryImage.width ?? 1000}
              />
            ) : null}
          </>
        ) : (
          <span className="product-card__placeholder" />
        )}
      </Link>
      <div className="product-card__info">
        <span className="product-card__title"><Link href={href}>{product.title}</Link></span>
        <div className="product-card__price">
          <span className={onSale ? "product-card__sale-price" : undefined}>
            <span className="sr-only">Sale price</span>
            {priceVaries ? "From " : null}
            {formatMoney(price)}
          </span>
          {onSale ? (
            <s className="product-card__compare-price">
              <span className="sr-only">Regular price</span>
              {formatMoney(compareAt)}
            </s>
          ) : null}
        </div>
      </div>
    </article>
  );
}
