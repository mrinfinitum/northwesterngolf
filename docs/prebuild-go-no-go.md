# Pre-build go / no-go report

Audit date: August 27, 2026  
Decision: **YES WITH CONDITIONS**

## Decision meaning

Northwestern Golf can proceed toward a Next.js/Vercel retail storefront, but should not begin commerce integration or commit to production cutover until the Wholesale Gorilla and discount/checkout gates below are closed.

Work that does not depend on private commerce behavior—project foundation, design tokens, route shells, structured content modeling, global layout, and read-only public catalog queries—can begin after the team accepts this architecture. Product price presentation, customer-aware behavior, cart, wholesale, account handoff, checkout handoff, and analytics must wait for the required evidence and test fixtures.

The answer is not an unconditional “yes” because the current wholesale implementation is Liquid/theme-coupled and customer-specific pricing cannot be verified anonymously. The answer is not “no” because standard Shopify product data, retail Storefront Cart API, hosted customer accounts, Shopify Checkout, AlphaLogic-managed variant sale prices, and GOVX's code-based checkout flow all have viable headless boundaries.

## Confirmed

- Shopify remains a suitable commerce backend for products, variants, collections, inventory, price, compare-at price, retail cart, checkout, customers, and orders.
- The current store uses Shopify's new passwordless hosted customer accounts. `/account/login` redirects to Shopify's hosted account surface.
- The lowest-risk account choice is **Option A: Shopify-hosted customer accounts**. No Supabase customer database is needed or recommended.
- Standard retail checkout should begin from Storefront Cart API's Shopify `checkoutUrl`; Shopify owns final totals, shipping, tax, discounts, payment, order creation, and confirmation.
- Wholesale Gorilla is active, uses Shopify customer accounts, and exposes the current active customer tag `Wholesale`.
- Anonymous retail pricing remains visible because Wholesale Gorilla's public `loginToViewPrices` setting is false.
- Wholesale Gorilla's public global minimum order, volume discounts, custom wholesale shipping, net checkout, PO requirement, cart-note requirement, product exclusions, page locks, and quantity rules are disabled/empty in the captured anonymous configuration.
- Those disabled public settings do not reveal customer-specific price lists or prove the logged-in order path.
- AlphaLogic's visible 30% price-reduction campaign is reflected in Shopify variant `price` and `compare-at price`, so Storefront API consumers receive the actual sale price.
- AlphaLogic's announcement bar, cart savings display, and “Regular price” line attribute are theme JavaScript behavior and will not migrate automatically.
- GOVX currently opens a hosted verification popup, advertises 15%, and results in a Shopify-native, single-use code that the customer enters at checkout.
- GOVX officially supports full custom links and OAuth. The current simple hosted-link flow is likely sufficient for Next.js after vendor/domain approval and one complete staging test.
- Okendo review UI is theme-injected today, but Okendo documents supported headless approaches; plan/API/metafield entitlement still needs confirmation.
- Google/GA4/Ads/Merchant and Meta web pixels are present. Shopify's public pixel configuration includes checkout and purchase events.
- Shopify must remain authoritative for `purchase`. Next.js must never emit a purchase based on a redirect or thank-you-page guess.
- Important homepage, footer, landing-page, and PDP editorial content is stored in or bound through the theme and needs a structured migration before theme retirement.

## Must resolve before building commerce

### 1. Wholesale Gorilla contract — blocker

Obtain a written answer from Wholesale Gorilla and pass a tagged-account test covering:

- hosted portal versus supported headless integration;
- login/session handoff from Shopify-hosted customer accounts;
- price-list selection for the `Wholesale` tag;
- product/collection eligibility and exclusions;
- variant price, inventory, and availability;
- quick-order form and reorder behavior;
- cart validation, minimums, and quantity rules;
- discount-code interaction;
- shipping, tax, payment terms, and accelerated checkout;
- standard order versus draft/net order creation; and
- logout/session expiry.

Until this passes, do not build wholesale PDP prices, wholesale collection visibility, or a wholesale cart in Next.js.

### 2. Discount truth and combinations

Export all active/scheduled Shopify and AlphaLogic discounts, Wholesale Gorilla price lists, and GOVX rule settings. Resolve the unknown combinations in `headless-compatibility.md` and execute the signed retail/wholesale/GOVX/AlphaLogic test matrix.

The public storefront cannot prove:

- whether AlphaLogic automatic/coupon discounts or code-blocking rules are active;
- whether those rules use Shopify Functions;
- whether GOVX stacks with sale or wholesale prices;
- whether Wholesale Gorilla pricing reaches a Storefront Cart or only its own order path; or
- whether other Shopify codes/automatic discounts are active and combinable.

### 3. Customer and buyer identity

Verify Shopify-hosted login/logout, account return URLs, order history, addresses, checkout authentication, and Wholesale Gorilla's recognition of the logged-in customer. Confirm whether native Shopify B2B company/location records are in use.

### 4. Checkout inventory

Export all enabled Checkout UI extensions, Functions, validation rules, shipping/delivery customizations, payment customizations, post-purchase/thank-you/order-status apps, Markets, tax settings, Shop Pay/accelerated checkout settings, and any scripts still in service. Public storefront HTML cannot enumerate these.

### 5. Analytics ownership

Identify the app pixel with API client `123074`/account `VeKatU`, the generic app pixel, and the custom pixel code. Approve a single event specification in which Next.js owns upper-funnel/storefront events and Shopify owns checkout/purchase. Complete consent and deduplication QA before production.

## Can resolve during build

These items are lower risk once their current configuration is exported:

- Okendo headless widget/metafield/API selection and review SEO;
- native search UI, filters, sort, pagination, boosts, and synonyms;
- hCaptcha or equivalent contact-form spam protection;
- content migration into approved metafields/metaobjects/static configuration;
- visual reproduction of AlphaLogic's bar and savings UI after campaign ownership is decided;
- GOVX CTA/popup accessibility and mobile fallback after the vendor approves the link/domain;
- responsive galleries, drawers, carousels, sticky elements, and shared components;
- policy rendering/hosted-route choice and privacy-choice surface;
- SEO/schema/image-performance work already defined in the original migration audit; and
- upper-funnel analytics implementation after the event contract is approved.

“During build” does not mean “after launch.” Each item still needs staging acceptance before cutover.

## Requires Shopify Admin access

**SHOPIFY ADMIN INVESTIGATION REQUIRED**

- Installed apps, plans, scopes, app proxies, webhooks, app-owned metafields, and accountable owners.
- Wholesale Gorilla price lists, tagged customers, registration/approval form, limits, exclusions, shipping, tax, payment terms, draft/net order settings, and hosted portal URLs.
- AlphaLogic campaigns, direct price changes, restore rules, schedules, targets/exclusions, automatic/coupon discounts, Functions, code blockers, and combination settings.
- GOVX campaign, eligible groups, 15% rule, product/collection eligibility, minimums, price rule, expiry, combination settings, checkout block, and marketplace settings.
- Shopify Discounts and Functions inventory.
- Customer account settings, account UI extensions, customer tags/segments, protected-data configuration, and native B2B company/location usage.
- Checkout editor, UI extensions, validation/delivery/payment Functions, post-purchase apps, shipping profiles, payments, Markets, and taxes.
- Customer Events/pixels, custom pixel code, server-side destinations, consent settings, Google/Meta data sharing, Klaviyo/TikTok status, and purchase event paths.
- Published theme export, template assignments, section settings, Custom Liquid, dynamic sources, metafield/metaobject definitions, menus, Search & Discovery settings, and media manifest.

## Potential blockers

| Potential blocker | Why it matters | Required resolution |
| --- | --- | --- |
| Wholesale Gorilla lacks supported headless pricing/cart | A logged-in wholesale buyer could see or pay the wrong price, access the wrong catalog, or create the wrong order type. | Use its proven hosted portal or obtain a supported API/contract. If neither exists, pause wholesale migration. |
| Wholesale and Shopify account sessions do not cross the selected surfaces | Correct `Wholesale` tag/price list may not be available when browsing or checking out. | Vendor-backed login/portal/checkout test with an approved wholesale account. |
| Undiscovered AlphaLogic/Shopify discount Functions | Storefront Cart estimates and checkout discounts could differ; codes might be intentionally blocked on sale products. | Full discount export and combination tests. |
| Checkout extension/customization not compatible with headless cart attributes/buyer identity | Shipping, validation, upsell, payment, or messaging behavior could be lost. | Checkout editor/Function inventory and staging checkout tests. |
| Duplicate or missing purchase measurement | Revenue reporting and ad optimization would be materially corrupted. | Keep purchase Shopify-only; identify all pixels and debugger-test one transaction per provider. |
| Theme-only content not exported before retirement | Homepage, landing pages, PDP specifications, trust content, and navigation/footer data could be lost. | Complete and sign the mapping in `theme-content-migration.md`. |

If Wholesale Gorilla cannot support either a hosted-portal coexistence model or a documented headless model, the retail storefront can still be headless, but wholesale must remain on a separate supported Shopify/vendor surface. Replacing Wholesale Gorilla or moving to Shopify B2B would be a separate architecture and migration decision, not an incidental implementation change.

## Go/no-go gates

Production commerce implementation is authorized only when all are true:

- [ ] Wholesale architecture selected and vendor-supported.
- [ ] Approved `Wholesale` test customer completes a representative order at the correct price.
- [ ] Discount inventory and compatibility matrix are signed by commerce owner.
- [ ] Retail, sale, GOVX, and wholesale checkout scenarios pass with expected order allocations.
- [ ] Hosted customer account and checkout identity handoff pass.
- [ ] Checkout extensions/Functions/shipping/payment configuration are inventoried.
- [ ] Pixel providers and custom code are identified.
- [ ] Exactly-once analytics spec passes, with Shopify as purchase authority.
- [ ] Theme content export and target ownership are complete.
- [ ] Rollback path keeps the Liquid storefront and wholesale channel operational until cutover acceptance.

## Exact recommended next action

Request a time-boxed, read-only Shopify evidence session and create one approved wholesale test customer plus non-production test products/codes. In that same work item, send Wholesale Gorilla support the proposed **Next.js retail + Shopify-hosted accounts + Wholesale Gorilla hosted portal + Shopify Checkout** diagram from `headless-architecture.md` and require written confirmation of the supported authentication, pricing, cart, and order path.

Do not start cart, customer-aware pricing, wholesale, or checkout integration until that response and the recorded tagged-customer test close the wholesale blocker. After it closes, update the compatibility matrix and authorize the commerce build.

