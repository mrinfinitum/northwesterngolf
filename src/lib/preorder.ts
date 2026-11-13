import type { Product, ProductVariant } from "@/lib/shopify/types";

/** Sellable with no stock on hand: Shopify's "Continue selling when out of stock". */
export function isPreorderVariant(variant: Pick<ProductVariant, "availableForSale" | "currentlyNotInStock"> | null | undefined) {
  return Boolean(variant?.availableForSale && variant.currentlyNotInStock);
}

/** Every sellable variant is a pre-order (nothing ships today). */
export function isPreorderProduct(product: Pick<Product, "availableForSale" | "variants">) {
  const sellable = product.variants.filter((variant) => variant.availableForSale);
  return product.availableForSale && sellable.length > 0 && sellable.every(isPreorderVariant);
}
