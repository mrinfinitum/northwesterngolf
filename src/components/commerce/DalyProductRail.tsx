import type { Product } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

export function DalyProductRail({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="daly-product-rail">
      <header className="daly-product-rail__header">
        <div>
          <p className="daly-section-kicker">More to explore</p>
          <h2>Explore More Clubs</h2>
        </div>
        <p>{products.length.toString().padStart(2, "0")} products</p>
      </header>
      <div className="daly-product-rail__track">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
