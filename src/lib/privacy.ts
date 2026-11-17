/**
 * "Do not sell or share" opt-out for this browser (US state privacy laws). A shopper is
 * opted out when their browser sends Global Privacy Control or they press "Opt out" on
 * /pages/data-sharing-opt-out, which sets this first-party cookie. Opted-out browsers
 * still get Google Analytics measurement, but the Google tag runs with Consent Mode
 * ad signals denied (no ad cookies, remarketing, ad personalization or Google signals).
 */
export const PRIVACY_OPT_OUT_COOKIE = "nwg_privacy_opt_out";
export const PRIVACY_CHOICES_PATH = "/pages/data-sharing-opt-out";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Consent Mode values for an opted-out browser. */
export const AD_SIGNALS_DENIED = { ad_personalization: "denied", ad_storage: "denied", ad_user_data: "denied" } as const;
const AD_SIGNALS_GRANTED = { ad_personalization: "granted", ad_storage: "granted", ad_user_data: "granted" } as const;

/** Inline-script expression (no imports available there) that is true for an opted-out browser. */
export const OPTED_OUT_EXPRESSION = `(navigator.globalPrivacyControl === true || /(?:^|;\\s*)${PRIVACY_OPT_OUT_COOKIE}=1(?:;|$)/.test(document.cookie))`;

export function hasGlobalPrivacyControl() {
  return typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function hasOptOutCookie() {
  return typeof document !== "undefined" && new RegExp(`(?:^|;\\s*)${PRIVACY_OPT_OUT_COOKIE}=1(?:;|$)`).test(document.cookie);
}

type ConsentGtag = (command: "consent" | "set", ...args: unknown[]) => void;

function updateGoogleConsent(values: Record<string, string>, redact: boolean) {
  const gtag = (window as unknown as { gtag?: ConsentGtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", values);
  gtag("set", "ads_data_redaction", redact);
}

export function setOptOut(optedOut: boolean) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = optedOut
    ? `${PRIVACY_OPT_OUT_COOKIE}=1; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`
    : `${PRIVACY_OPT_OUT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  // Apply to the tag already running on this page; later pages read the cookie at load.
  if (optedOut) updateGoogleConsent(AD_SIGNALS_DENIED, true);
  else if (!hasGlobalPrivacyControl()) updateGoogleConsent(AD_SIGNALS_GRANTED, false);
}
