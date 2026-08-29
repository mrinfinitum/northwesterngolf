import type { Product } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <div className="empty-state"><h2>No products found</h2><p>Try another collection or search.</p></div>;
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} priority={index < 4} product={product} />
      ))}
    </div>
  );
}
