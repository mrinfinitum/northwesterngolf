"use client";

import Link from "next/link";
import { Countdown, endsLabel, useRemaining } from "@/components/promo/Countdown";
import type { PromoBar as PromoBarContent } from "@/config/promo";

export function PromoBar({ promo }: { promo: PromoBarContent }) {
  const endsAt = promo.endsAt ? Date.parse(promo.endsAt) : null;
  const remaining = useRemaining(endsAt);
  if (remaining === 0) return null;

  return (
    <Link className="promo-bar" href={promo.cta.href}>
      <span className="promo-bar__headline">
        <span className="promo-bar__label">{promo.label}</span>
        <span className="promo-bar__offer">{promo.offer}</span>
        <span className="promo-bar__subline">{promo.subline}</span>
      </span>
      {endsAt ? (
        <span className="promo-bar__timer">
          <span aria-hidden="true" className="promo-bar__timer-label">Ends in</span>
          <span className="sr-only">Ends {endsLabel(endsAt)}</span>
          <Countdown remaining={remaining} />
        </span>
      ) : null}
      <span className="promo-bar__cta">
        {promo.cta.label}
        <svg aria-hidden="true" height="10" viewBox="0 0 18 10" width="14">
          <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
    </Link>
  );
}
