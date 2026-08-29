import type { Cart } from "@/lib/shopify/types";
import { formatMoney } from "@/components/commerce/Money";
import { CheckoutButton } from "./CheckoutButton";

export function CartSummary({ cart, pending }: { cart: Cart; pending: boolean }) {
  const discount = cart.discountApplications.reduce(
    (total, application) => total + Number(application.totalAllocatedAmount.amount),
    0,
  );

  return (
    <div className="cart-summary">
      <div className="cart-summary__row">
        <span>Subtotal</span>
        <strong>{formatMoney(cart.cost.subtotalAmount)}</strong>
      </div>
      {discount > 0 ? (
        <div className="cart-summary__row cart-summary__discount">
          <span>Discounts</span>
          <strong>−{formatMoney({ amount: discount.toFixed(2), currencyCode: cart.cost.totalAmount.currencyCode })}</strong>
        </div>
      ) : null}
      <p>Taxes and shipping are calculated in Shopify checkout. Final totals may change.</p>
      <CheckoutButton disabled={pending || cart.totalQuantity < 1} />
    </div>
  );
}
