import type { Money as MoneyType } from "@/lib/shopify";

export function formatMoney(money: MoneyType) {
  return new Intl.NumberFormat("en-US", {
    currency: money.currencyCode,
    style: "currency",
  }).format(Number(money.amount));
}

export function Money({ value }: { value: MoneyType }) {
  return <>{formatMoney(value)}</>;
}
