import Script from "next/script";
import { AD_SIGNALS_DENIED, OPTED_OUT_EXPRESSION } from "@/lib/privacy";

/**
 * The Google tag (GA4 + the Google Ads destination), set up like @next/third-parties'
 * GoogleAnalytics, except that browsers that opted out of "sale/sharing" (Global
 * Privacy Control or the opt-out cookie, see src/lib/privacy.ts) get Consent Mode ad
 * signals denied *before* the tag is configured, so nothing ad-related is sent.
 */
export function GoogleTag({ id }: { id: string }) {
  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var nwgOptedOut = ${OPTED_OUT_EXPRESSION};
if (nwgOptedOut) {
  gtag('consent', 'default', ${JSON.stringify(AD_SIGNALS_DENIED)});
  gtag('set', 'ads_data_redaction', true);
}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)}, nwgOptedOut ? { allow_google_signals: false, allow_ad_personalization_signals: false } : {});`;

  return (
    <>
      <Script dangerouslySetInnerHTML={{ __html: init }} id="nwg-google-tag-init" />
      <Script id="nwg-google-tag" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} />
    </>
  );
}
