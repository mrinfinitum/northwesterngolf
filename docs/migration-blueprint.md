# Northwestern Golf headless migration blueprint

Audit date: 2026-08-27  
Target direction: Next.js storefront on Vercel with Shopify retained for products, variants, inventory, prices, customers, orders, cart, and checkout.  
Status: audit and architecture only; no storefront implementation has begun.

## Documentation set

- [Site inventory](./site-inventory.md): routes, templates, global UI, homepage, products, collections, cards, cart, search, responsive behavior, interactions, media, and accessibility.
- [Design system](./design-system.md): measurable color, typography, width, spacing, radius, shadow, button, input, breakpoint, and motion tokens.
- [Shopify data map](./shopify-data-map.md): source-of-truth ownership and Admin-inspection requirements.
- [Integration inventory](./integration-inventory.md): apps, pixels, evidence, headless concerns, and investigation actions.
- [SEO migration](./seo-migration.md): URL preservation, metadata, schema, sitemap/robots, redirect, and cutover requirements.
- [Component map](./component-map.md): proposed reusable Next.js page/component/data architecture.
- [Migration risks](./migration-risks.md): risk levels, critical dependencies, mitigations, and go/no-go gates.

## 1. Existing architecture

The current storefront is Shopify Online Store using Impact 6.11.2 with custom Shopify theme sections and app blocks. Its public catalog is deliberately compact: 20 products under one vendor, organized by audience, club category, Talon SS/Thunderbird family, tags, and 16 sitemap-listed collections. Shopify product types are blank.

The site combines:

- Shopify-native products, variants, collections, pages, blog, search, cart, accounts, policy content, payment terms, and checkout.
- Theme-owned homepage, header/footer configuration, product editorial blocks, accordions, trust messaging, swatches, sticky/quick add, and curated testimonials.
- App-owned reviews, wholesale behavior, promotion/discount messaging, GOVX verification, and marketing pixels.
- Shopify-hosted new customer accounts and checkout.

The headless boundary should leave commerce truth in Shopify, render public/storefront-readable content in Next.js, and keep app logic behind supported contracts. Theme JSON/settings must be migrated because Storefront API cannot read them after the theme stops serving pages.

## 2. Page templates

Required templates:

1. Homepage: video hero, two art-directed image overlays, featured collection/product carousel, testimonial scroller.
2. Product: media gallery/zoom, selected variant, sparse option combinations, quantity, Add to Cart, installment terms, GOVX, accordions/editorial content, Okendo, related products, sticky Add to Cart.
3. Collection: title/count, two/three-column cards, Availability/Price filters, sort, mobile drawer, pagination.
4. Search: global predictive drawer plus full result page with products/content grouping, filters, sort, pagination/empty states.
5. Cart: globally persistent drawer and full page with notes/shipping estimate/payment icons and Shopify checkout handoff.
6. Generic content page: page title and rich content.
7. Campaign content page: finite reusable sections for Talon SS, Thunderbird Full Set, Wedges, Our Story.
8. Contact: Shopify-compatible or deliberately replaced form flow with spam protection.
9. Blog index/article: preserve empty News index and support future article content/schema.
10. Policy/privacy: refund/privacy/terms and data-sharing opt-out.
11. Account handoff: Shopify-hosted new customer accounts unless a later approved Customer Account API scope changes the requirement.
12. 404, loading, empty, unavailable, and upstream-error states.

All existing handles and route conventions remain. Nested collection-product aliases canonicalize to the primary product route, and `?variant=` retains selection semantics.

## 3. Design system

The faithful base system is:

- Barlow 400/700 for body and headings; uppercase bold headings with negative tracking.
- Primary ink `#1A1A1A`, white surfaces, pale gray `#F8F8F8`, orange campaign accent `#FF711F`/hero `#F96F1E`, and theme secondary `#F0C417`.
- Wide maximum 1460 px, standard/narrow approximately 1210 px, footer 1200 px, and responsive gutters 20/32/48 px.
- Typography steps at 700 and 1400 px; display reaches 80 px.
- Section spacing scales from roughly 48 px mobile to 96 px at wide desktop.
- Theme buttons are pill-shaped; homepage campaign CTAs are intentionally square.
- 6/12/24 px card/panel radii, 8 px inputs, 1 px neutral borders, and subtle black shadows.
- Breakpoints centered on 700, 1000, 1150, 1400, 1600 px, with 430/749/768 custom exceptions.
- Short CSS transitions and scroll-snap are sufficient; no general animation library is warranted.

Mobile art direction is part of the brand system: the Daly panels use different mobile assets, the product gallery changes interaction model, filters/navigation/cart become drawers, and product grids remain two columns even at 375 px.

## 4. Component system

The implementation should be built from these reusable domains:

```text
layout      PromotionBar, Header, navigation drawers/dropdowns, Footer
commerce    ProductCard/Grid/Carousel, Gallery, Price, VariantSelector,
            QuantitySelector, AddToCart, StickyAddToCart, recommendations
collection  Header, toolbar, filters, sort, mobile filter drawer, pagination
cart        Provider, drawer/page, items, totals, note, estimator, checkout
search      Drawer/form, predictive groups, result page, empty states
content     VideoHero, ImageOverlay, FeaturedCollection, ImageText,
            TestimonialScroller, RichText, Contact, Blog/Article
integrations Okendo, GOVX, wholesale, analytics, consent boundaries
seo         metadata mapping, breadcrumbs, JSON-LD
ui          Button, fields, badge, accordion, dialog, drawer, icons
```

Server render content, product/collection/search results, metadata, and schema. Isolate client state to drawers, predictive input, variant/gallery selection, cart mutations, filters/navigation, timers, and sticky visibility. The same ProductCard, filter primitives, drawer primitive, cart items, and image-overlay sections must be reused across page contexts.

## 5. Shopify data requirements

### Direct Storefront data

- Product/Variant: IDs, handles, titles, descriptions, vendor, tags, options, selected options, SKU, GTIN where available, price, compare-at price, availability, media, variant image, SEO.
- Collection: handle/title/description/image/SEO, products, filter metadata, sort, pagination.
- Menu: configured header and footer menu trees after Admin handles are known.
- Page/Blog/Article: handles, titles, bodies, author/date/media/SEO as applicable.
- Cart: ID, lines, quantities, merchandise, costs, discount allocations/codes, note, buyer identity, checkout URL, user errors.
- Search: product, collection, page, and article results plus native filters/sorts.
- Customer: hosted account flow or approved Customer Account API design.

### Content needing mapping

**SOURCE NEEDS SHOPIFY ADMIN INSPECTION:** homepage settings, custom footer, product short copy, specifications, “what's included,” shipping/returns, warranty/trust callouts, swatches, badges, editorial product sections, FAQs, manuals/downloads/videos, related product selection, and testimonial blocks.

Export theme JSON/dynamic-source bindings before implementation. Each field needs one authoritative target: Shopify resource, typed metafield, metaobject, version-controlled configuration, or app integration. Do not invent namespaces based on the frontend.

### Data-layer principles

- Shopify owns money, availability, discounts, buyer identity, and checkout URL.
- Use variant IDs as purchase identity and derive valid option combinations from actual variants.
- Keep cart ID in a secure HTTP-only cookie and run Storefront calls server-side.
- Cache only public content with explicit revalidation/webhook invalidation; never public-cache cart/customer/wholesale state.
- Preserve market, currency, country, locale, and buyer context.
- Sanitize legacy Elementor description HTML without losing content.

## 6. Integrations

### Confirmed and required to investigate

- **Okendo:** product reviews/ratings and schema ownership; obtain headless/API access.
- **Wholesale Gorilla:** customer approval/tags, catalogs/prices, minimums, tax/shipping/cart/checkout behavior; critical blocker until vendor-supported headless parity is proven.
- **AlphaLogic Bulk Discount Manager:** sitewide 30% sale bar and possible discount logic; distinguish messaging from discount execution.
- **GOVX ID:** identity verification and discount issuance; require official headless redirect/token/cart design.
- **Shopify customer accounts:** currently hosted on Shopify; use this as initial parity baseline.
- **Shop Pay/payments:** leave financial eligibility and checkout on Shopify.
- **Shopify native search/Search & Discovery:** current search/facet source; verify Admin configuration before adding a provider.
- **Google/GA/Ads/Merchant and Meta:** active through Shopify Web Pixels; Next.js events and Shopify checkout events need one deduplicated consent-aware plan.
- **Unknown app pixel and custom pixel:** identify/export in Shopify Customer Events before analytics implementation.
- **Shopify form hCaptcha:** contact form needs an explicit headless submission/protection path.

No public evidence proves subscriptions, loyalty, wishlist, chat, bundles, Algolia/Searchspring, accessibility overlay, or a TikTok advertising pixel. Confirm Admin-side integrations rather than assuming absence.

## 7. SEO requirements

- Retain `https://northwestern.golf` and every current product, collection, page, blog, policy, search, cart, and account-login path listed in `seo-migration.md`.
- Preserve base-product canonical URLs, `?variant=` selection, nested product aliases/canonicals, filter/sort canonical stripping, and pagination self-canonicals.
- Export/import existing Shopify redirects from Admin.
- Render current/Shopify SEO title, description, canonical, OG/Twitter media, and stable one-H1 hierarchy.
- Generate ProductGroup/Product/Offer, Organization/WebSite/SearchAction, BreadcrumbList, and future Article JSON-LD from the same rendered data.
- Decide Okendo aggregate-rating schema ownership and prevent duplicates.
- Publish a complete sitemap and equivalent robots policy at cutover; diff URL sets mechanically.
- Return real 404s for missing handles; avoid soft-404 homepage redirects.
- Preserve image URLs where practical and all internal navigation/CTA destinations.
- Baseline Search Console, analytics, crawl metadata, backlinks, indexation, and Core Web Vitals before traffic switch.

Known launch decisions include missing/overlong metadata, duplicate H1s, mostly missing product-media alt text, an empty indexed blog, and stale Thunderbird landing-page prices. Track these as explicit content/SEO changes rather than side effects of rebuilding.

## 8. Responsive behavior

Target and compare at 375, 430, 768, 1024, and 1440 px.

- 375/430: hamburger, search/cart, no account below 700, two-column cards, one-column PDP, mobile media dots, full-width sticky ATC, mobile-specific campaign art, filter/cart/search drawers, single testimonial.
- 768: account control returns but navigation remains drawer-based; 32 px gutters; viewport-height video hero; PDP still one column.
- 1024: two-column PDP with sticky info, collection filter sidebar, three testimonials, but header remains in mobile/tablet navigation mode.
- 1440: full desktop nav, 48 px gutters, three-column collection content, largest heading/section scale.

Mobile is a separate composition, not merely stacked desktop. Validate touch, pointer, keyboard, zoom, reduced motion, and screen-reader behavior. The audit's CSS/DOM findings need rendered screenshot confirmation once a browser/test build is available.

## 9. Migration risks

### High

- Wholesale Gorilla pricing/customer/cart/checkout rules.
- Shopify account identity and wholesale/customer-tag linkage.
- AlphaLogic/GOVX/wholesale/compare-at discount composition.
- Theme-only/dynamically bound content extraction.
- Checkout extensions/functions/attributes not visible publicly.
- Analytics/custom/app pixel consent and deduplication.

### Medium

- Storefront Cart API parity and shipping/free-shipping behavior.
- Okendo and GOVX headless implementations.
- Native search relevance/API parity.
- Sparse variant combination and variant-media logic.
- SEO/canonical/redirect migration.
- Art-directed imagery and rendered responsive fidelity.
- Contact form, policies, and privacy choices.

### Low

- Core design tokens, page shell, product cards/grid, standard collection UI, anonymous retail product rendering, static content layouts, policy/blog shells, basic motion, and 404/empty states.

Go/no-go criteria and investigation detail are in `migration-risks.md`.

## 10. Recommended build sequence

The requested 16-phase outline is retained, with explicit discovery gates before the app-dependent phases.

### Phase 1 — Project foundation

- Read the installed Next.js version documentation and define supported runtime/deployment conventions.
- Establish environment validation, Shopify client boundary, lint/type/test/CI, preview deployments, error logging, security headers, and a staging-indexation block.
- Define Shopify market/locale/currency context and cache/webhook strategy.

**Done when:** a non-commerce shell deploys safely to preview with no production-domain/DNS change.

### Phase 2 — Design system

- Encode Barlow, color, type, width, spacing, radius, shadow, breakpoint, input, button, icon, and motion tokens from `design-system.md`.
- Build/document UI primitives and accessibility contracts.

**Done when:** tokens/primitives visually match target samples at all five audit widths.

### Phase 3 — Global layout

- Implement promotion/header/navigation/search/cart shell/footer visually, but keep app-owned data behind adapters.
- Build accessible shared Drawer/Dialog primitives and responsive header behavior.

**Dependency:** Admin export of navigation/footer/promotion ownership.

### Phase 4 — Homepage

- Implement reusable VideoHero, ImageOverlay, FeaturedCollection shell, and TestimonialScroller using exported content.
- Preserve mobile art direction, autoplay/reduced-motion handling, and exact CTAs.

**Dependency:** resolve first Daly CTA destination and testimonial source.

### Phase 5 — Shopify data layer

- Add reusable fragments/services for products, variants, collections, menus, pages, blogs, search, recommendations, SEO, and cart.
- Add webhook-driven revalidation and upstream error handling.

**Done when:** representative resources resolve by handle/ID with market-aware money and typed errors.

### Phase 6 — Product cards

- Implement the shared card, responsive image sizing, sale/sold-out badges, secondary hover image, direct/multi-variant quick add.
- Verify sold-out Talon and available Thunderbird samples.

### Phase 7 — Collections

- Implement collection header/count, current Availability/Price filters, sort, mobile drawer, grid, and pagination.
- Preserve URL/canonical/crawl behavior.

### Phase 8 — Product pages

- Implement gallery/zoom, sparse option resolver, URL selection, price/availability, quantity, Add to Cart shell, accordions/editorial renderer, trust blocks, sticky ATC, and recommendations.
- Verify Driver, Talon, Golf Bag, and Wedge test fixtures.

**Dependency:** completed theme-content/metafield mapping. Do not include wholesale/GOVX/Okendo as guessed placeholders.

### Phase 9 — Search

- Implement predictive grouped drawer and full search page using Shopify native search.
- Evaluate an agreed query set before considering any third-party provider.

### Phase 10 — Cart

- Implement secure cart cookie, server mutations, optimistic/reconciled drawer/page, notes, totals, checkout handoff, and required estimator/free-shipping behavior.
- Test invalid/sold-out/price-changed lines and market context.

**Hard dependency:** discount/wholesale/checkout rule investigation.

### Phase 11 — Customer accounts

- Implement Shopify-hosted account handoff/callback/logout first, unless Customer Account API UI is explicitly approved.
- Verify orders/addresses/profile and every wholesale state.

### Phase 12 — Third-party integrations

- Integrate Okendo, GOVX, Wholesale Gorilla, AlphaLogic-derived promotion/discount behavior, contact protection, and any Admin-only discoveries through vendor-supported contracts.
- Provide safe degradation for nonessential widgets; never degrade silently for pricing/eligibility.

**Hard gate:** vendor confirmation and scenario acceptance tests.

### Phase 13 — SEO and schema

- Finalize metadata, canonicals, JSON-LD, breadcrumbs, robots, sitemap, redirects, status codes, pagination/filter behavior, and social media.
- Run old/new crawl diff and structured-data validation.

### Phase 14 — Analytics

- Implement the approved consent-aware event spec for Google, Meta, the identified app pixel, and custom pixel requirements.
- Split storefront/checkout ownership and validate deduplication/product IDs/value/currency.

### Phase 15 — QA

- Visual regression at 375/430/768/1024/1440; Chrome/Safari/Firefox and relevant iOS/Android.
- Keyboard/screen-reader/focus/contrast/reduced-motion audit.
- Retail/wholesale/GOVX product-cart-account-checkout scenarios.
- Search, contact, policy/privacy, analytics, performance, fault/recovery, schema, redirects, 404, and load testing.

**Done when:** every high-risk exit criterion in `migration-risks.md` passes and stakeholders sign off.

### Phase 16 — Production cutover

- Freeze content/handle changes, capture final Shopify crawl/config snapshot, confirm rollback, then switch traffic only under an approved cutover plan.
- Publish sitemap/robots, monitor errors/orders/totals/indexation/analytics/CWV, and keep the Shopify theme rollback-ready during the stability window.
- No DNS action is part of this audit.

## Immediate next actions before any rebuild

1. Export published theme settings/templates and map every dynamic source.
2. Export metafield/metaobject/menu/redirect/Search & Discovery configuration.
3. Inventory apps, Shopify Functions, discounts, checkout extensions, Customer Events, account mode, Markets, shipping, and payments in Admin.
4. Obtain Wholesale Gorilla, GOVX, and Okendo headless guidance and test credentials.
5. Approve the wholesale/account/discount/analytics architecture and acceptance matrix.
6. Capture rendered desktop/mobile screenshots and interaction recordings of the current site to supplement this source-level audit.
7. Baseline SEO/analytics/business metrics and freeze route handles through migration.

After those actions, Phase 1 can begin under a separate explicit implementation instruction.
