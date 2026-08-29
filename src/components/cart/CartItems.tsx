"use client";

import Image from "next/image";
import Link from "next/link";
import type { Cart } from "@/lib/shopify/types";
import { formatMoney } from "@/components/commerce/Money";

export function CartItems({
  cart,
  pending,
  removeLine,
  updateQuantity,
}: {
  cart: Cart;
  pending: boolean;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
}) {
  return (
    <ul className="cart-items">
      {cart.lines.map((line) => {
        const options = line.merchandise.selectedOptions.filter(
          (option) => option.name !== "Title" && option.value !== "Default Title",
        );
        return (
          <li className="cart-item" key={line.id}>
            <Link className="cart-item__media" href={`/products/${line.merchandise.product.handle}`}>
              {line.merchandise.image ? (
                <Image
                  alt={line.merchandise.image.altText || line.merchandise.product.title}
                  fill
                  sizes="112px"
                  src={line.merchandise.image.url}
                />
              ) : <span>NW</span>}
            </Link>
            <div className="cart-item__details">
              <Link href={`/products/${line.merchandise.product.handle}`}>
                <h2>{line.merchandise.product.title}</h2>
              </Link>
              {options.length ? (
                <p className="cart-item__options">
                  {options.map((option) => `${option.name}: ${option.value}`).join(" · ")}
                </p>
              ) : null}
              <p className="cart-item__price">{formatMoney(line.cost.totalAmount)}</p>
              <div className="cart-item__actions">
                <div aria-label={`Quantity for ${line.merchandise.product.title}`} className="cart-quantity">
                  <button
                    aria-label="Decrease quantity"
                    disabled={pending || line.quantity <= 1}
                    onClick={() => updateQuantity(line.id, line.quantity - 1)}
                    type="button"
                  >−</button>
                  <output aria-live="polite">{line.quantity}</output>
                  <button
                    aria-label="Increase quantity"
                    disabled={pending || line.quantity >= 99}
                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                    type="button"
                  >+</button>
                </div>
                <button
                  className="cart-item__remove"
                  disabled={pending}
                  onClick={() => removeLine(line.id)}
                  type="button"
                >Remove</button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
