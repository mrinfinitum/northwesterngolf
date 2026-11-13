"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { long: "Days", ms: 86_400_000, short: "days" },
  { long: "Hours", ms: 3_600_000, short: "hrs" },
  { long: "Minutes", ms: 60_000, short: "min" },
  { long: "Seconds", ms: 1_000, short: "sec" },
] as const;

/** Milliseconds left until `endsAt`, ticking every second. Null until mounted (server and first paint). */
export function useRemaining(endsAt: number | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (endsAt === null) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);
  return endsAt === null || now === null ? null : Math.max(0, endsAt - now);
}

/** Boxed DD:HH:MM:SS clock. Shows "--" before mount so the layout never jumps. */
export function Countdown({ labels = "short", remaining }: { labels?: "long" | "short"; remaining: number | null }) {
  const parts = UNITS.map((unit, index) => {
    // Whole units left after the larger units above are taken out.
    const larger = index ? UNITS[index - 1].ms : Infinity;
    const value = Math.floor(((remaining ?? 0) % larger) / unit.ms);
    return { name: unit[labels], value: remaining === null ? "--" : String(value).padStart(2, "0") };
  });
  return (
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
  );
}

export function endsLabel(endsAt: number) {
  return new Date(endsAt).toLocaleString("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "long",
    timeZone: "America/Chicago",
    timeZoneName: "short",
  });
}
