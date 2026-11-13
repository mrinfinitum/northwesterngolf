import { ItemListTracker } from "@/components/analytics/ItemListTracker";
import { ProductCard } from "@/components/commerce/ProductCard";
import { listItems } from "@/lib/analytics";
import type { RelatedProductsSection } from "@/lib/product-content";
import { getProduct, getProductRecommendations, type Product } from "@/lib/shopify";

const MAX_PRODUCTS = 5;

async function relatedProducts(handle: string, fallbackHandles: string[]) {
  const recommended = await getProductRecommendations(handle);
  if (recommended.length) return recommended;
  // Tokenless Storefront recommendations are empty for this shop, so fall back
  // to the products live currently recommends (minus the product itself).
  const products = await Promise.all(
    fallbackHandles.filter((item) => item !== handle).map((item) => getProduct(item).catch(() => null)),
  );
  return products.filter((product): product is Product => Boolean(product));
}

export async function PdpRelatedProducts({ handle, section }: { handle: string; section: RelatedProductsSection }) {
  const products = (await relatedProducts(handle, section.handles)).slice(0, MAX_PRODUCTS);
  if (!products.length) return null;

  return (
    <section aria-labelledby="nwg-pdp-related-heading" className="nwg-pdp-related">
      <h2 className="nwg-pdp-related__heading" id="nwg-pdp-related-heading">{section.heading}</h2>
      <ItemListTracker items={listItems(products)} listId="related-products" listName={section.heading}>
        <div className="nwg-pdp-related__list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </ItemListTracker>
    </section>
  );
}
