import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { getCartAction } from "./actions";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";

export const metadata: Metadata = {
  title: "Cart",
  robots: { follow: true, index: false },
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const enabled = isRetailCartEnabled();
  const result = enabled ? await getCartAction() : null;

  return (
    <div className="cart-page page-shell page-shell--wide">
      <CartPageClient enabled={enabled} initialCart={result?.cart ?? null} />
    </div>
  );
}
