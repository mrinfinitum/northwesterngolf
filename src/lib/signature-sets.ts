import { getProducts, type Product } from "@/lib/shopify";

/** The John Daly Signature Sets, always smallest junior first, then Men's. */
export const SIGNATURE_SETS = [
  { handle: "junior-john-daly-signature-set-ages-5-8", label: "Junior Set · Ages 5-8", note: "Right or left hand" },
  { handle: "junior-john-daly-signature-set-ages-9-12", label: "Junior Set · Ages 9-12", note: "Right or left hand" },
  { handle: "mens-john-daly-signature-set", label: "Men’s Set", note: "Stiff or Regular flex" },
];

export type SignatureSet = (typeof SIGNATURE_SETS)[number] & { product: Product };

/** The sets that exist in Shopify, in display order. Empty on any API error. */
export async function getSignatureSets(): Promise<SignatureSet[]> {
  try {
    const products = await getProducts({ first: 20, query: "title:*Daly*" });
    return SIGNATURE_SETS.flatMap((set) => {
      const product = products.find((item) => item.handle === set.handle);
      return product ? [{ ...set, product }] : [];
    });
  } catch {
    return [];
  }
}
