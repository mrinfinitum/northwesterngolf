"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromoBar as PromoBarContent } from "@/config/promo";

const UNITS = [
  { name: "days", ms: 86_400_000 },
  { name: "hrs", ms: 3_600_000 },
  { name: "min", ms: 60_000 },
  { name: "sec", ms: 1_000 },
] as const;

function split(remaining: number) {
  let rest = Math.max(0, remaining);
  return UNITS.map((unit) => {
    const value = Math.floor(rest / unit.ms);
    rest -= value * unit.ms;
    return { name: unit.name, value: String(value).padStart(2, "0") };
  });
}

/** Countdown to `endsAt`. Renders nothing on the server so the markup never mismatches. */
function Countdown({ endsAt, onEnd }: { endsAt: number; onEnd: () => void }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (now !== null && now >= endsAt) onEnd();
  }, [endsAt, now, onEnd]);

  if (now === null) return null;
  const parts = split(endsAt - now);
  return (
    <span className="promo-bar__timer">
      <span aria-hidden="true" className="promo-bar__timer-label">Ends in</span>
      <span className="sr-only">Ends {new Date(endsAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</span>
      <span aria-hidden="true" className="promo-clock">
        {parts.map((part, index) => (
          <span className="promo-clock__group" key={part.name}>
            {index ? <span className="promo-clock__colon">:</span> : null}
            <span className="promo-clock__unit">
              <span className="promo-clock__digits">{part.value}</span>
              <span className="promo-clock__name">{part.name}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function PromoBar({ promo }: { promo: PromoBarContent }) {
  const endsAt = promo.endsAt ? Date.parse(promo.endsAt) : null;
  const [ended, setEnded] = useState(false);
  if (ended) return null;

  return (
    <Link className="promo-bar" href={promo.cta.href}>
      <span className="promo-bar__headline">
        <span className="promo-bar__label">{promo.label}</span>
        <span className="promo-bar__offer">{promo.offer}</span>
        <span className="promo-bar__subline">{promo.subline}</span>
      </span>
      {endsAt ? <Countdown endsAt={endsAt} onEnd={() => setEnded(true)} /> : null}
      <span className="promo-bar__cta">
        {promo.cta.label}
        <svg aria-hidden="true" height="10" viewBox="0 0 18 10" width="14">
          <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
    </Link>
  );
}
