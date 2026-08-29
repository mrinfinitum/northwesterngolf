import type { Product } from "@/lib/shopify";

export function DalyProductEditorial({ product }: { product: Product }) {
  const firstVariant = product.variants[0];
  const specificationRows = [
    product.vendor ? ["Brand", product.vendor] : null,
    product.productType ? ["Category", product.productType] : null,
    ["Availability", product.availableForSale ? "In stock" : "Sold out"],
    ["SKU", firstVariant?.sku || "—"],
    ...product.options
      .filter((option) => option.name !== "Title")
      .map((option) => [option.name, option.values.join(", ")]),
  ].filter((row): row is string[] => Boolean(row));

  return (
    <section className="daly-product-details" id="product-details">
      <div className="daly-product-details__inner">
        <nav aria-label="Product information" className="daly-product-details__nav">
          <a className="is-active" href="#specifications">Specifications</a>
          <a href="#technology">Technology</a>
          <a href="#details">Details</a>
          <span aria-disabled="true">Reviews</span>
        </nav>

        <div className="daly-product-details__content">
          <section id="specifications">
            <p className="daly-section-kicker">Club information</p>
            <h2>Specifications</h2>
            <dl className="daly-specifications">
              {specificationRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="technology">
            <p className="daly-section-kicker">Product details</p>
            <h2 id="details">Technology &amp; details</h2>
            <div
              className="daly-product-details__description rich-text"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </section>
        </div>
      </div>
    </section>
  );
}
