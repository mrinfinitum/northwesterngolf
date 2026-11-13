"use client";

import { useRemaining } from "@/components/promo/Countdown";
import type { PromoBar } from "@/config/promo";

const pad = (value: number) => String(value).padStart(2, "0");

/** "18d 04h 52m", ticking with the sale countdown. */
function compact(remaining: number) {
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return days ? `${days}d ${pad(hours)}h ${pad(minutes)}m` : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

/**
 * Launch Event strip under the product price: the offer plus a live "ends in" clock.
 * Shown only while the product is on sale and the event hasn't ended.
 */
export function PdpDeal({ percentOff, promo }: { percentOff: number; promo: PromoBar }) {
  const endsAt = promo.endsAt ? Date.parse(promo.endsAt) : null;
  const remaining = useRemaining(endsAt);
  if (remaining === 0) return null;

  return (
    <p className="nwg-pdp-deal">
      <span className="nwg-pdp-deal__tag">{promo.label}</span>
      <span className="nwg-pdp-deal__offer">Save {percentOff}% · Limited time</span>
      {endsAt ? (
        <span className="nwg-pdp-deal__clock">
          Ends in <strong>{remaining === null ? "--" : compact(remaining)}</strong>
        </span>
      ) : null}
    </p>
  );
}
