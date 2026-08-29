# Migration risk report

Audit date: 2026-08-27

Risk reflects uncertainty and business impact, not implementation effort alone. A visually simple feature can be high risk when its price, identity, compliance, or checkout behavior is app-owned.

## Executive risk view

The catalog, public page routes, visual system, core product cards, and standard retail collection UI are straightforward to recreate. The critical path is instead defined by four cross-cutting dependencies:

1. Wholesale Gorilla pricing, customer eligibility, cart, shipping, and checkout behavior.
2. Shopify-hosted new customer accounts and customer-tag/account state.
3. AlphaLogic/GOVX/Shopify discount interaction and final-price ownership.
4. Marketing/custom pixels split across the Next.js storefront and Shopify checkout.

These must be resolved before commerce implementation is called production-ready.

## High risk

### Wholesale pricing and customer segmentation

**Evidence:** Wholesale Gorilla theme extension/configuration is active, with customer tags, price visibility, approval/customer-review, catalog/cart/quick-order, shipping/local-delivery, and payment-button behaviors.

**Failure mode:** an approved wholesale user sees retail prices, cannot access the correct catalog, violates minimums, receives wrong tax/shipping treatment, or checks out at an incorrect total. Theme DOM scripts will not run in Next.js.

**Investigate before implementation:**

- Vendor-supported headless architecture and plan entitlement.
- Every wholesale customer tag/company state and approval transition.
- Price source: B2B catalog/price list, automatic discount, Shopify Function, app proxy, draft order, line attribute, or checkout adjustment.
- Product visibility, minimum order/quantity multiples, quick-order needs, tax exemptions, shipping/local delivery, payment terms, and checkout restrictions.
- Test accounts/expected totals for anonymous retail, signed-in retail, pending, approved, and rejected wholesale users.

**Exit criterion:** vendor-approved architecture plus automated scenario fixtures proving product, cart, and checkout totals/eligibility for every state.

### Customer accounts and identity

**Evidence:** `/account/login` redirects to Shopify's new customer accounts on `shopify.com/72808693923/account...`.

**Failure mode:** broken return/logout flow, lost account session, inaccessible order/address history, or inability to resolve wholesale/GOVX state.

**Investigate before implementation:**

- Shopify account mode and Customer Account API eligibility.
- Hosted-account vs custom UI decision.
- OAuth/return URLs, domain/session behavior, profile/order/address requirements.
- Account extensions, B2B/wholesale approval, customer tags, and returns workflow.
- Privacy/security requirements for token storage and personal data.

**Exit criterion:** an approved account journey tested end-to-end across storefront, hosted account, cart, and checkout with wholesale states.

### Discount and promotion composition

**Evidence:** AlphaLogic advertises a sitewide 30% sale; products also use compare-at prices; GOVX offers an eligibility discount; Wholesale Gorilla may alter pricing; Shopify checkout owns final discounts.

**Failure mode:** marketing copy promises an unapplied discount, discounts stack when they should not, or displayed product/cart totals diverge from checkout.

**Investigate before implementation:**

- Shopify automatic/code discounts and Functions.
- AlphaLogic campaign rules, quantity tiers, exclusions, schedule, and headless API.
- GOVX issuance/application/stacking rules.
- Wholesale pricing/discount interaction and Markets behavior.
- Exact expected totals for representative products/customers/markets.

**Exit criterion:** one authoritative rule matrix and cart-to-checkout test suite with zero unexplained deltas.

### Theme-only and dynamically bound content

**Evidence:** homepage, custom footer, product accordions, short product copy, trust callouts, swatches, and many product editorial blocks are visible, but public output cannot reveal whether each value is a theme setting, metafield, metaobject, or app block.

**Failure mode:** visually incomplete pages after the theme is retired, manually duplicated content that drifts, or lost per-product templates/dynamic-source bindings.

**Investigate before implementation:**

- Export published theme JSON/settings and all product template assignments.
- Inspect each block's dynamic source.
- Inventory metafield/metaobject definitions and app-owned namespaces.
- Choose a Storefront-readable target for every theme-only value before cutover.

**Exit criterion:** signed content migration matrix with source, destination, owner, fallback, and validation URL for every section/block.

### Checkout customizations and app behavior

**Evidence:** checkout is Shopify-hosted; payment/Shop Pay assets are present; wholesale styles suppress express controls under some states. Public storefront cannot expose checkout UI extensions, Shopify Functions, post-purchase, scripts, or shipping/payment customizations.

**Failure mode:** checkout receives incomplete buyer/cart attributes, app discounts disappear, payment/shipping options change, or analytics double-fire.

**Investigate before implementation:**

- Checkout editor/customizations and extensions.
- Shopify Functions, cart transforms, delivery/payment customizations, legacy Scripts if any.
- Required cart/line attributes, buyer identity, notes, discount codes, and market context.
- Thank-you/order-status/post-purchase integrations.

**Exit criterion:** Admin inventory plus successful retail/wholesale/GOVX test checkouts in an approved non-production flow.

### Analytics, pixels, consent, and attribution

**Evidence:** Shopify Web Pixels Manager config includes Google/Ads/GA/Merchant events, Meta pixel with CAPI, an unidentified app pixel, and a custom pixel.

**Failure mode:** missing SPA page views, duplicate purchases, broken ad attribution, unconsented marketing events, or differing product identifiers between storefront and checkout.

**Investigate before implementation:**

- Export all Shopify Customer Events/app/custom pixel settings/code.
- Identify the unknown app pixel (API client ID 123074/account `VeKatU`).
- Define event owner and deduplication ID for each funnel event across Next.js and Shopify checkout.
- Confirm consent categories, regional behavior, product-ID format, currency/value, enhanced data, and CAPI ownership.

**Exit criterion:** approved analytics specification and debugger-tested staging events with exactly-once purchase measurement.

## Medium risk

### Storefront Cart API parity

The standard mutations are straightforward, but app prices/discounts, shipping estimator, free-shipping state, buyer identity, notes, markets, and checkout attributes make parity non-trivial. The current free-shipping threshold is zero and needs a business decision. Treat totals returned by Shopify as authoritative.

### GOVX ID

Verification modal/redirect, token/discount handoff, permitted domains, stacking, expiration, and consent need vendor support. This becomes high risk if no supported headless flow exists.

### Okendo reviews

Review display/submission, aggregate synchronization, product mapping, login state, moderation, styling, and schema need an Okendo-supported headless route. Purchase should degrade safely if reviews fail.

### Search relevance and feature parity

Native predictive search is enough functionally, but the `driver` query matched all 20 products because terms in descriptions broaden results. Storefront API vs theme endpoint ranking/resource grouping must be tested before deciding on a provider.

### Product variant state

Sparse combinations on the men's driver, variant-linked bag images/swatches, sold-out Talon variants, URL state, and sticky/quick add require a single robust resolver. Incorrect Cartesian option logic could allow nonexistent variants.

### Shopify page-builder/theme content migration

Once content sources are identified, translating the finite section vocabulary is manageable. Risk is primarily completeness and content drift, especially stale prices on the Thunderbird landing page.

### SEO route/canonical migration

Route count is small, but rankings can be harmed by handle normalization, nested-product behavior, filter/pagination canonicals, omitted sitemap URLs, wrong status codes, or a premature metadata rewrite. Existing Shopify redirect rules require Admin export.

### Image art direction and performance

Homepage uses distinct desktop/mobile files; PDP images vary from square to portrait; first media priority and later lazy loading matter. A blanket aspect ratio/crop will cause visible regressions or CLS.

### Contact form and spam protection

Shopify storefront-form hCaptcha does not automatically transfer. Submission destination, notifications, privacy, spam protection, accessible validation, and failure recovery need explicit ownership.

### Policies and privacy choices

Policy URLs and data-sharing opt-out are compliance-sensitive. The correct content source, consent/pixel relationship, market applicability, and legal approval must be preserved.

### Responsive/interaction fidelity

The breakpoint rules are known, but the interactive browser was unavailable during audit. Transparent-header transitions, focus traps, hover/focus menus, image focal points, swipe/zoom, and sticky controls need rendered verification at 375, 430, 768, 1024, and 1440 px.

## Low risk

- Global font loading, color/spacing/radius/shadow tokens.
- Static header/footer visual recreation after content ownership is confirmed.
- Homepage video/image-overlay layouts and curated testimonial cards after settings export.
- Product price/title/image display for anonymous retail users.
- Reusable product card and two/three-column grids.
- Collection title/count and current Availability/Price filter UI.
- Standard sort URL controls and cursor pagination.
- Product quantity control and standard available/sold-out button states.
- Policy/page rich-text rendering once content source is selected.
- Empty blog index and future article template shell.
- 404 page and standard loading/empty/error states.
- CSS-only hover, fade, short drawer transitions, and scroll-snap. No animation library is needed.

Low risk does not mean “skip QA”; it means there is a clear, observable implementation path without a hidden business-system dependency.

## Cross-cutting risk register

| Risk | Probability | Impact | Mitigation owner/action |
|---|---|---|---|
| Wholesale total differs from checkout | High until proven | Critical | Commerce lead + Wholesale Gorilla/vendor; rule matrix and scenario tests. |
| Theme-only content unavailable through API | High | High | Content/Shopify Admin export before theme retirement. |
| Customer login/session breaks | Medium | High | Account architecture spike with Shopify hosted accounts. |
| Discounts stack/diverge | Medium/High | Critical | Discount inventory and cart/checkout fixtures. |
| Duplicate/missing purchase analytics | High without spec | High | Analytics event ownership/dedup plan. |
| SEO URL/canonical regression | Medium | High | Automated old/new crawl diff and redirect import. |
| Missing product image alt/metadata | High (already present) | Medium | Shopify content remediation and fallbacks. |
| Campaign price copy remains stale | High (already present) | Medium | Content owner replaces hardcoded price or adds dynamic source. |
| Mobile visual regression | Medium | Medium/High | Device/browser screenshots and art-direction tests. |
| Native search relevance disappoints | Medium | Medium | Query-set evaluation before any provider decision. |
| Contact form loses submissions | Medium | High | Delivery/spam/error monitoring test. |
| App vendor lacks headless support | Unknown | Critical for wholesale/GOVX | Written vendor confirmation and fallback decision before build phase. |

## Go/no-go gates

Do not start production commerce integration until:

- Shopify Admin content/app export is complete.
- Wholesale Gorilla and GOVX headless paths are vendor-confirmed or explicitly descoped by the business.
- Account architecture is approved.
- Discount source/stacking matrix is approved.
- Checkout customizations/functions are inventoried.

Do not cut over traffic until:

- Retail and all wholesale/GOVX scenario totals match Shopify checkout.
- Search/cart/account/checkout work on required devices.
- Old/new SEO crawl diff passes and existing redirects are imported.
- Google/Meta/app/custom pixels are consent-correct and deduplicated.
- Policy/privacy/contact behavior is approved.
- Visual comparison passes the five target viewport widths.
- Rollback criteria and monitoring dashboards are in place.

## Fallback principles

- Keep checkout Shopify-hosted.
- Prefer Shopify-hosted customer accounts for initial parity if a custom account adds risk without user value.
- If an app lacks headless support, do not emulate proprietary pricing/verification logic. Pause that surface, obtain an approved vendor alternative, or keep it Shopify-hosted.
- Keep the current Shopify theme available as a rollback target until the headless site completes a stable post-launch window.
- Never “fix” pricing, discount, policy, or SEO content silently in code; assign ownership and change the authoritative source.
