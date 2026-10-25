import Link from "next/link";
import type { Product } from "@/lib/shopify";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ChevronRightSmallIcon } from "@/components/ui/icons";

export function FeaturedCollection({
  heading,
  href,
  linkLabel,
  products,
}: {
  heading: string;
  href: string;
  linkLabel: string;
  products: Product[];
}) {
  return (
    <section className="featured-collection">
      <div className="featured-collection__header">
        <h2>{heading}</h2>
        <Link className="view-all-link" href={href}>
          <span className="reversed-link">{linkLabel}</span>
          <span className="circle-chevron"><ChevronRightSmallIcon /></span>
        </Link>
      </div>
      <div className="featured-collection__list">
        {products.map((product, index) => (
          <ProductCard key={product.id} priority={index < 3} product={product} />
        ))}
      </div>
    </section>
  );
}
