import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import { formatMoney } from "./Money";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.featuredImage ?? product.images[0];
  const secondaryImage = product.images.find((candidate) => candidate.id !== image?.id);
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.maxVariantPrice;
  const onSale = Number(compareAt.amount) > Number(price.amount);
  const savings = onSale ? Number(compareAt.amount) - Number(price.amount) : 0;

  return (
    <article className="product-card">
      <Link className="product-card__media" href={`/products/${product.handle}`}>
        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              className="product-card__image product-card__image--primary"
              fill
              priority={priority}
              sizes="(min-width: 1200px) 30vw, (min-width: 700px) 45vw, 50vw"
              src={image.url}
            />
            {secondaryImage ? (
              <Image
                alt=""
                aria-hidden="true"
                className="product-card__image product-card__image--secondary"
                fill
                sizes="(min-width: 1200px) 30vw, (min-width: 700px) 45vw, 50vw"
                src={secondaryImage.url}
              />
            ) : null}
          </>
        ) : (
          <span className="product-card__placeholder">Northwestern Golf</span>
        )}
        {onSale ? <span className="product-card__badge">Save {formatMoney({ amount: savings.toFixed(2), currencyCode: price.currencyCode })}</span> : null}
      </Link>
      <div className="product-card__body">
        <Link href={`/products/${product.handle}`}><h3>{product.title}</h3></Link>
        <div className="product-card__price">
          <span className={onSale ? "price price--sale" : "price"}>{formatMoney(price)}</span>
          {onSale ? <s>{formatMoney(compareAt)}</s> : null}
        </div>
      </div>
    </article>
  );
}
