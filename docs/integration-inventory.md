# Shopify app and integration inventory

Audit date: 2026-08-27  
Scope: public storefront evidence only. App installation status, plan, scopes, server-side functions, webhooks, and Admin configuration must be confirmed in Shopify Admin.

## Summary

| Integration | Evidence level | Migration risk |
|---|---|---|
| Okendo Reviews | Confirmed | Medium |
| Wholesale Gorilla | Confirmed | High |
| AlphaLogic Bulk Discount Manager | Confirmed | High until discount ownership is known |
| GOVX ID | Confirmed | Medium/High |
| Shopify new customer accounts | Confirmed | High |
| Shopify Shop Pay / accelerated checkout | Confirmed | Medium; keep Shopify checkout |
| Native Shopify predictive search/facets | Confirmed | Low/Medium |
| Google analytics/ads/merchant events | Confirmed pixel configuration | Medium |
| Meta Pixel / Conversions API configuration | Confirmed pixel configuration | Medium |
| Unidentified app web pixel | Confirmed existence; vendor unknown | Medium |
| Shopify custom pixel | Confirmed existence; code unknown | Medium/High |
| Swiper 11 | Confirmed front-end dependency | Low |
| Shopify hCaptcha/storefront forms | Confirmed | Low/Medium |

## Confirmed integrations

### Okendo Reviews

**Purpose:** product ratings and reviews.

**Where it appears:** product pages; rating insertion points and the full lower-page reviews experience. The homepage “Golfers Are Talking” scroller is a separate custom section and should not be assumed to come from Okendo.

**Evidence:**

- `cdn-static.okendo.io/reviews-widget-plus/js/okendo-reviews.js`
- Okendo CSS/fonts from `d3hw6dc1ow8pp2.cloudfront.net`
- Okendo review data/metafield-oriented markup in product output

**Headless migration concern:** Shopify theme app blocks do not automatically render in Next.js. Review count, aggregate rating, review list, review submission, moderation state, customer identity, product ID mapping, and review structured data need an Okendo-supported headless path. Avoid displaying stale cached aggregates.

**Recommended investigation:**

- Confirm Okendo plan and headless/API access.
- Export widget configuration, styles, locale, moderation rules, and product mappings.
- Confirm whether Okendo emits Product `aggregateRating` structured data and how duplicate schema is prevented.
- Decide whether the homepage testimonials intentionally remain curated and separate.

### Wholesale Gorilla

**Purpose:** wholesale pricing/access, customer approval/tag rules, wholesale catalog/order behavior, and checkout/cart adaptations.

**Where it appears:** global storefront configuration, customer/account logic, product/cart styling and behavior. Additional checkout/payment controls are hidden by wholesale styles under relevant states.

**Evidence:**

- Shopify theme app extension asset `wholesale-gorilla-44/assets/wsg-dependencies.js`.
- Public `wsgData`/version configuration, including Wholesale active tag behavior.
- Selectors/configuration for price visibility, cart, quick-order/customer-review/approval behavior, shipping/local-delivery, and wholesale catalog compatibility.

**Headless migration concern:** this is the largest app risk. Theme DOM manipulation cannot be carried into React. Customer tags, approval status, price lists, catalog visibility, minimums/multiples, tax handling, shipping, discount application, quick-order workflow, and checkout handoff may depend on app code or Shopify Functions. A Storefront API product price may not equal the price a wholesale customer should receive.

**Recommended investigation:**

- Confirm plan (“Essential” was exposed publicly but must be verified), installed modules, app owner, and vendor headless support.
- Obtain a complete matrix of customer tags, pricing rules, product eligibility, minimums, tax/shipping rules, and approval states.
- Test anonymous, retail-account, pending-wholesale, approved-wholesale, and rejected/disabled users.
- Determine whether pricing is represented by Shopify B2B catalogs/price lists, automatic discounts, draft orders, app proxy, line-item properties, or checkout adjustment.
- Do not launch cart, accounts, or checkout until vendor-supported parity is proven.

### AlphaLogic Bulk Discount Manager

**Purpose:** sitewide promotion messaging and possibly quantity/bulk discount presentation or logic.

**Where it appears:** top promotion bar and globally injected product/variant configuration.

**Evidence:**

- Theme extension `al-bulk-discount-manager-86/assets/bar.js`.
- Global `alpha_bulk_discounts` configuration.
- Visible message “Sitewide Sale: Take 30% Off All Products,” orange `#FF711F`, linked to `/collections/all`.

**Headless migration concern:** the bar is presentation; the actual discount may be a Shopify automatic discount, app discount function, code, or price change. Rebuilding only the bar could advertise a discount that is not applied. The app may also inject tier pricing not exercised by the sampled products.

**Recommended investigation:**

- Inspect AlphaLogic campaigns and Shopify Discounts/Functions.
- Record eligibility, exclusions, dates, stacking, market/customer behavior, and checkout evidence.
- Ask the vendor whether a headless rendering/API contract exists.
- Keep announcement content and discount calculation as separate migration workstreams.

### GOVX ID

**Purpose:** identity verification and eligibility discount for military, first responders, government employees, and teachers.

**Where it appears:** product purchase area.

**Evidence:** GOVX theme app block/assets and eligibility copy; public references to `auth.govx.com`.

**Headless migration concern:** the app block, verification modal/redirect, token exchange, discount issuance, cart association, and checkout behavior may assume Shopify theme DOM/session state. Discount links or codes may be sensitive.

**Recommended investigation:**

- Obtain GOVX's official headless documentation and permitted domains/redirect URIs.
- Confirm product/customer eligibility and discount stacking with the sitewide sale/wholesale rules.
- Test success, cancel, expiration, retry, and already-verified flows.
- Confirm analytics/consent and accessibility of the verification modal/redirect.

### Shopify new customer accounts

**Purpose:** authentication, customer profile, addresses, and order history.

**Where it appears:** header account icon and mobile Account link.

**Evidence:** `/account/login` redirects to `https://shopify.com/72808693923/account...` through Shopify customer-authentication endpoints.

**Headless migration concern:** account sessions cross domains and interact directly with Wholesale Gorilla/customer tags. The storefront cannot assume legacy customer-access-token behavior.

**Recommended investigation:** confirm account mode, branding, return URLs, Customer Account API eligibility, account extensions, B2B behavior, wholesale approval, and logout/session expectations. Hosted-account handoff is the safest initial parity baseline unless the product requirements explicitly call for a custom account UI.

### Shopify Shop Pay, payment terms, and accelerated checkout

**Purpose:** payment methods, installments, wallets, and checkout.

**Where it appears:** Shop Pay installment copy on eligible PDPs; payment icons on cart; checkout destination/assets.

**Evidence:** Shopify portable-wallet/accelerated-checkout assets, Shop Pay payment terms, Shopify-hosted checkout URL, and payment icon set.

**Headless migration concern:** payment availability, installment eligibility, taxes, shipping, and final discounts belong to Shopify checkout. Wholesale Gorilla may suppress accelerated controls for wholesale users.

**Recommended investigation:** retain checkout handoff using `Cart.checkoutUrl`; inventory checkout branding/extensions, payment methods, Shop Pay settings, test mode, and wholesale suppression rules. Never recreate installment amounts independently.

### Native Shopify search and Search & Discovery configuration

**Purpose:** predictive search, full search, faceting, sort, and possibly related products.

**Where it appears:** global search drawer, `/search`, collection filters, “You may also like.”

**Evidence:** native `/search/suggest.json`, Shopify tracking query parameters, `filter.v.availability` and `filter.v.price.*`, and no active third-party search asset.

**Headless migration concern:** Storefront API support and theme endpoints do not always expose identical result grouping/relevance. Search & Discovery merchandising and recommendations are Admin-owned.

**Recommended investigation:** confirm Search & Discovery installation/configuration, synonym rules, product boosts, filters, complementary/related products, and a representative relevance query set.

### Google channel / Google Analytics / Google Ads / Merchant Center events

**Purpose:** analytics, advertising conversion tracking, and merchant events.

**Where it appears:** Shopify Web Pixels Manager on all storefront pages.

**Evidence:** live pixel configuration includes:

- Google tag IDs `GT-5R3QNQJ8` and `GT-5NX8GBBF`.
- Google Ads ID `AW-17694000302` with event labels.
- GA measurement destination `G-T04EQ37VVZ`.
- Merchant Center destination `MC-4SVNY911XH`.
- Mappings for page view, view item/list/cart, search, add/remove cart, begin checkout, add shipping/payment information, and purchase.

**Headless migration concern:** Shopify's theme Web Pixels Manager will not observe all Next.js client navigation and custom cart actions automatically. Checkout events may still be Shopify-owned, creating deduplication challenges. Consent mode and enhanced/customer data rules matter.

**Recommended investigation:** export the Customer Events configuration and Google channel settings; define event owner, ID format, currency/value, consent gating, server/client split, and deduplication keys for every funnel event. Validate with Google tools in staging.

### Meta Pixel

**Purpose:** Meta advertising measurement and conversion events.

**Where it appears:** Shopify Web Pixels Manager globally.

**Evidence:** public pixel configuration identifies Meta/Facebook pixel `1058499582905322`; Shopify pixel metadata reports Facebook CAPI enabled.

**Headless migration concern:** Next.js page views and cart actions need explicit event publishing; Shopify checkout may emit the downstream events. Browser and server/CAPI events must share deduplication identifiers and obey consent.

**Recommended investigation:** inspect Facebook & Instagram channel settings, domain verification, event matching, consent, catalog product ID format, Aggregated Event Measurement, and purchase deduplication.

### Unidentified app web pixel

**Purpose:** unknown marketing/behavior tracking; configuration enables added-to-cart events.

**Where it appears:** Shopify Web Pixels Manager globally.

**Evidence:** strict-sandbox app pixel ID `1909555363`, API client ID `123074`, account value `VeKatU`, and decoded configuration `{"enableAddedToCartEvents": true}`.

**Headless migration concern:** the vendor cannot be determined reliably from public output. The six-character account value resembles identifiers used by some email/marketing platforms, but that is not enough evidence to label it Klaviyo.

**Recommended investigation:** in Shopify Admin → Settings → Customer events, identify the app and owner. Export subscribed events, consent purposes, destination account, and headless installation instructions. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION.**

### Shopify custom pixel

**Purpose:** unknown merchant-authored analytics/marketing behavior.

**Where it appears:** global Web Pixels Manager.

**Evidence:** public configuration includes an active `shopify-custom-pixel` in a lax sandbox with Analytics and Marketing purposes.

**Headless migration concern:** custom code and destinations are deliberately not exposed in the HTML. It may duplicate or supplement Google/Meta events.

**Recommended investigation:** export the full custom pixel code/settings and map each subscription/destination. Review privacy, secrets, unsupported DOM assumptions, checkout ownership, and deduplication. **SOURCE NEEDS SHOPIFY ADMIN INSPECTION.**

### Shopify hCaptcha / storefront forms

**Purpose:** contact/storefront form abuse protection.

**Where it appears:** global storefront forms assets; relevant to `/pages/contact`.

**Evidence:** Shopify storefront forms hCaptcha bundle.

**Headless migration concern:** a custom Next.js contact form cannot inherit theme-form protection. It needs a deliberate submission destination, validation, anti-spam, error/success UX, privacy handling, and notification ownership.

**Recommended investigation:** determine where contact submissions currently go and whether Shopify's contact form endpoint remains acceptable from headless. Preserve accessible error and challenge behavior.

### Swiper 11

**Purpose:** carousel utility for custom theme sections.

**Where it appears:** homepage assets/slider behavior.

**Evidence:** `cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css` and JavaScript.

**Headless migration concern:** low. Current behaviors can likely be reproduced with CSS scroll-snap and small React controls; do not carry the dependency automatically.

**Recommended investigation:** inventory every Swiper-initialized section during visual QA. Retain it only if native scroll behavior cannot meet touch, looping, focus, and accessibility requirements.

## No public evidence found

No conclusive public asset/configuration evidence was found for:

- loyalty/rewards;
- wishlist;
- subscriptions (Recharge, Loop subscriptions, or native selling plans);
- bundles;
- chat/helpdesk widget such as Gorgias, Zendesk, or Intercom;
- Judge.me or Yotpo reviews;
- Algolia, Searchspring, or an active Boost search provider;
- accessibility overlay;
- SMS capture such as Attentive/Postscript;
- TikTok advertising pixel (a TikTok social link is present, but a TikTok pixel was not identified);
- separate store/dealer-locator provider.

Absence from public HTML is not proof an app is uninstalled; checkout-only, server-side, Admin-only, Shopify Function, webhook, and consent-blocked integrations require Admin inspection.

No conclusive Klaviyo onsite script was found. Because an unidentified app web pixel exists, Klaviyo status must be confirmed in Admin rather than guessed.

## Required Admin evidence package before implementation

1. Installed-app list, app owner, plan, scopes, and renewal status.
2. Shopify Customer Events list, each app/custom pixel configuration, consent purpose, and code export.
3. Shopify Functions, automatic discounts, discount codes, and app discount campaigns.
4. Checkout editor screenshots/export, checkout UI extensions, post-purchase apps, and thank-you/order-status extensions.
5. Wholesale customer tags/companies, catalogs/price lists, approval workflows, minimums, shipping/tax rules, and vendor headless guidance.
6. GOVX headless contract and redirect/domain settings.
7. Okendo API/headless access, product mappings, and schema strategy.
8. Search & Discovery filters, synonyms, boosts, related/complementary products.
9. Marketing channel product-ID conventions and event deduplication strategy.
10. Contact-form destination and anti-spam requirements.

Do not remove, replace, or consolidate any integration until this package is reviewed with the store owner.
