"use client";

import { useSyncExternalStore } from "react";
import { hasGlobalPrivacyControl, hasOptOutCookie, setOptOut } from "@/lib/privacy";

type Status = "gpc" | "opted-out" | "opted-in";

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getStatus = (): Status => (hasGlobalPrivacyControl() ? "gpc" : hasOptOutCookie() ? "opted-out" : "opted-in");

function choose(optedOut: boolean) {
  setOptOut(optedOut);
  listeners.forEach((listener) => listener());
}

/** Replaces Shopify's opt-out form (its script can't run on the headless site). */
export function PrivacyChoices({ email }: { email: string }) {
  // null on the server and during hydration: the choice lives in this browser only.
  const status = useSyncExternalStore<Status | null>(subscribe, getStatus, () => null);
  const accountHref = `mailto:${email}?subject=${encodeURIComponent("Do not sell or share my personal information")}&body=${encodeURIComponent("Please opt the customer account with this email address out of the sale or sharing of personal information.")}`;

  return (
    <section aria-labelledby="privacy-choices-heading" className="nwg-privacy-choices">
      <h2 id="privacy-choices-heading">Opt out on this browser</h2>
      <p aria-live="polite" role="status">
        {status === "gpc"
          ? "Your browser is sending a Global Privacy Control signal, so this browser is opted out."
          : status === "opted-out"
            ? "This browser is opted out."
            : status === "opted-in"
              ? "This browser is not opted out."
              : "Checking this browser’s privacy choice…"}
      </p>
      {status === "opted-in" ? (
        <button className="button button--primary" onClick={() => choose(true)} type="button">Opt out</button>
      ) : null}
      {status === "opted-out" ? (
        <button className="nwg-privacy-choices__undo" onClick={() => choose(false)} type="button">Opt back in</button>
      ) : null}
      <p className="nwg-privacy-choices__note">
        The choice is saved in a cookie on this browser and device. Clearing cookies resets it.
      </p>
      <h2>Opt out your customer account</h2>
      <p>
        To also opt out data linked to your customer account, <a href={accountHref}>email {email}</a> from the address on
        your account and we’ll apply it.
      </p>
    </section>
  );
}
