import Link from "next/link";
import type { Product } from "@/lib/shopify";
import { ProductCard } from "@/components/commerce/ProductCard";

export function FeaturedCollection({ products }: { products: Product[] }) {
  return (
    <section className="featured-collection section-shell">
      <div className="section-heading">
        <h2>Most Wanted</h2>
        <Link href="/collections/mens-collection">View all</Link>
      </div>
      <div className="featured-collection__track">
        {products.map((product, index) => <ProductCard key={product.id} priority={index < 4} product={product} />)}
      </div>
    </section>
  );
}
