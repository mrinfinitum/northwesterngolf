"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Countdown, endsLabel, useRemaining } from "@/components/promo/Countdown";
import type { PromoBar } from "@/config/promo";

/**
 * Launch Event panel over the homepage video. Falls back to the regular hero
 * copy (`children`) once the countdown runs out.
 */
export function HeroPromo({ children, promo }: { children: ReactNode; promo: PromoBar }) {
  const endsAt = promo.endsAt ? Date.parse(promo.endsAt) : null;
  const remaining = useRemaining(endsAt);
  if (remaining === 0) return children;

  return (
    <div className="hero-promo">
      <p className="hero-promo__eyebrow">{promo.hero.eyebrow}</p>
      <h1 className="hero-promo__title">
        {promo.label}
        <span className="hero-promo__offer">{promo.offer}</span>
      </h1>
      {endsAt ? (
        <div className="hero-promo__timer">
          <p aria-hidden="true" className="hero-promo__timer-label">Ends in</p>
          <p className="sr-only">Ends {endsLabel(endsAt)}</p>
          <Countdown labels="long" remaining={remaining} />
        </div>
      ) : null}
      <p className="hero-promo__note">{promo.hero.note}</p>
      <Link className="hero-promo__cta" href={promo.cta.href}>
        {promo.hero.cta}
        <svg aria-hidden="true" height="12" viewBox="0 0 18 10" width="18">
          <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </Link>
    </div>
  );
}
