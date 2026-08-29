import type { Cart } from "@/lib/shopify/types";

export const CART_UPDATED_EVENT = "northwestern:cart-updated";

export type CartUpdatedDetail = {
  cart: Cart | null;
  message?: string;
  ok?: boolean;
  open?: boolean;
};

export function publishCartUpdate(cart: Cart | null, open = false, message = "", ok = true) {
  window.dispatchEvent(
    new CustomEvent<CartUpdatedDetail>(CART_UPDATED_EVENT, {
      detail: { cart, message, ok, open },
    }),
  );
}
