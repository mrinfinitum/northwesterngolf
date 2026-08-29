# Northwestern Golf — Build Phase 1

Date: August 27, 2026  
Status: **IMPLEMENTED — RETAIL BROWSING FOUNDATION; COMMERCE GATE REMAINS CLOSED**

## Scope and boundary

This phase establishes the independent Next.js/Vercel storefront foundation. It did not modify the live Shopify theme, Shopify configuration, checkout, customer accounts, apps, analytics, DNS, or production deployment.

Shopify remains authoritative for products, variants, collections, current prices, compare-at prices, availability, images, pages, policies, customers, discounts, checkout, and orders. The application contains no parallel commerce database.

The explicit boundary is encoded in `src/lib/shopify/commerce-boundary.ts`:

- Retail browsing is implemented.
- Cart mutations and checkout handoff are deferred.
- Customer authentication and customer-specific pricing are deferred.
- Wholesale Gorilla is **BLOCKED PENDING VENDOR/ADMIN VERIFICATION**.
- GOVX transaction flow is deferred.
- No UI reports a successful commerce action. Cart and Add to Cart controls are visibly disabled and carry a deferred state marker.

## Implemented

### Application foundation

- Next.js 16.3.3 App Router with React 19 and strict TypeScript.
- React Server Components for catalog/content retrieval and page rendering.
- Client components limited to mobile navigation, search overlay, gallery controls, variant selection, and quantity presentation.
- Tailwind CSS 4 plus audited design tokens for colors, Barlow typography, widths, gutters, radii, controls, and responsive breakpoints.
- Vercel-compatible server-side Storefront API access with 15-minute fetch revalidation and resource tags. No production webhook endpoint was enabled.
- `.env.example` contains placeholders only. A local ignored `.env.local` was used to prove connectivity.

### Routes

Implemented and locally smoke-tested:

- `/`
- `/products/[handle]`
- `/collections/[handle]`
- `/collections/all`
- `/collections/[handle]/products/[productHandle]` (legacy 200 alias with canonical product URL)
- `/pages/[handle]`
- `/policies/[handle]`
- `/search?q=...`
- `/robots.txt`
- `/sitemap.xml`

Unknown products, collections, pages, and policies use the application 404 UI. Existing Shopify route shapes remain unchanged.

### Global shell

- Announcement bar.
- Sticky header and audited desktop navigation/dropdowns.
- Mobile drawer navigation with Escape handling and scroll locking.
- Search trigger and search overlay shell.
- Shopify-hosted account login link; no custom account implementation.
- Disabled cart shell at the commerce boundary.
- Audited footer groups, social links, and legal line.
- Skip link, visible keyboard focus treatment, accessible names, and reduced-motion treatment.

### Homepage

- Full-bleed campaign hero.
- John Daly partnership image overlay.
- Real Shopify-powered “Most Wanted” product section.
- Secondary campaign image overlay.
- Testimonial section.
- Responsive horizontal section behavior on smaller viewports.

### Collections and product cards

- Real collection title, product count, and product nodes.
- Responsive two-column mobile and three-column wide grid.
- Reusable cards with Shopify CDN image, secondary hover image, title, real price, real compare-at price, savings badge, availability, and preserved product URL.
- `/collections/all` uses the real Shopify product connection because `all` is a Shopify storefront route convention rather than a normal collection object.
- Filtering/sorting UI is not introduced because Search & Discovery/Admin configuration has not been exported and the current catalog does not require pagination within the first 48 items.

### Product detail and variants

- Breadcrumb, media gallery, desktop thumbnails, mobile arrows/dots, vendor, title, SKU when present, current price, compare-at price, availability, option controls, quantity presentation, and Shopify description HTML.
- Options and variants come directly from Shopify.
- Selecting an option resolves to a real variant; sparse option combinations fall back to a compatible real variant rather than manufacturing an invalid combination.
- The resolved variant controls displayed price, compare-at price, availability, SKU, and variant image when Shopify supplies one.
- Product JSON-LD uses Shopify product/variant data.
- Add to Cart is deliberately non-operational and does not fake success.

### Content, search, and SEO

- Shopify Page bodies and SEO fields drive `/pages/[handle]`.
- Shopify Shop Policies drive their original `/policies/[handle]` URLs.
- Native Storefront API search supports product, page, and article results; product results reuse `ProductGrid`.
- Dynamic product, collection, page, and policy metadata.
- Canonical URLs on preserved paths.
- Open Graph and Twitter metadata.
- Product structured data.
- Generated robots rules and a Storefront API-powered sitemap for product and collection URLs.
- Search is `noindex,follow`, matching the migration audit.

## Shopify data

### Connection

Read-only connectivity was proven against Northwestern Golf's permanent Shopify domain using Storefront API version `2026-07`. Public catalog data currently works without a Storefront token. The implementation sends `X-Shopify-Storefront-Access-Token` only when the server-side environment variable is non-empty.

The connection was proven through both a direct read-only GraphQL request and rendered local production routes. No access token was printed, sent to the browser, or committed.

### Verified real resources

- Products: real titles, handles, descriptions, product types, vendors, tags, SEO, and update timestamps.
- Variants: real IDs, selected options, SKUs, current prices, compare-at prices, availability, and variant images where present.
- Collections: real collection objects and their product connections, including `drivers`, `fairways`, and `golf-bags`.
- Images: real `cdn.shopify.com` URLs, alt text, width, and height.
- Pages: `our-story` and other accessible Shopify Page handles.
- Policies: refund, privacy, shipping when configured, and terms of service.
- Search: real product and content results.

Representative local evidence:

- `/products/men-s-thunderbird-driver` rendered Shopify's current `$209.99` price, `$299.99` compare-at price, real option values, images, and availability.
- `/products/thunderbird-golf-bag` rendered its real Color variants and associated data.
- `/collections/drivers` rendered real collection products and prices.
- `/pages/our-story` rendered its Shopify SEO title and Page content.
- `/policies/refund-policy` rendered the Shopify Shop Policy content at the original path.

AlphaLogic is not reimplemented. Whatever current price and compare-at price Shopify returns is displayed as authoritative.

### Data-layer organization

GraphQL implementation details are isolated under `src/lib/shopify/`:

- Shared product, image, and SEO fragments.
- Product/products, collection/collections, menu, page, policy, and search queries.
- Typed normalized Storefront models.
- One server-side fetch boundary with consistent environment handling, errors, caching, and tags.

Cart fragments and mutations were intentionally not created. Their absence is part of the commerce gate, not an incomplete catalog implementation.

## Static content

Theme-only homepage content is isolated in `src/config/site.ts` so it can be replaced without rewriting page components.

Temporarily represented in Next.js:

- Audited navigation hierarchy and footer link groups. Public tokenless Storefront access may not expose Shopify menus; the Menu query is ready for a permitted token/Admin-exported handle.
- Announcement copy. It is presentation only and performs no pricing calculation.
- Homepage campaign headings, calls to action, testimonial excerpts, and Shopify CDN campaign-image references.
- A CSS-built Northwestern wordmark approximation because the original theme logo asset/settings have not been exported.

This static configuration must not become the long-term merchant authoring model. The classification and target structure remain governed by `theme-content-migration.md`.

## Deferred

- Retail Cart API state and mutations.
- Shopify checkout handoff.
- Wholesale Gorilla and wholesale eligibility/pricing.
- Customer-aware pricing and customer-specific catalog restrictions.
- GOVX verification/discount transaction flow.
- Customer accounts beyond the Shopify-hosted login link.
- Discount-code entry and compatibility behavior.
- Analytics, pixels, Customer Events, and purchase attribution.
- Production revalidation webhook endpoint/configuration.
- AlphaLogic theme-only promotional UI beyond displaying Shopify's returned prices.
- Search predictive/autocomplete UX.
- Collection filtering and sorting.
- Shopify product recommendations/related products.
- Contact form submission and custom theme-only contact sections.

## Issues and audit deltas

1. **Theme section export is still required.** The public storefront confirms homepage content, but the original autoplay MP4 URL, responsive poster/crop settings, exact logo asset, and the complete section schema are theme-only. This phase uses audited static CDN images and does not claim the poster is the final video implementation.
2. **Menus need an authoritative export or permitted Storefront token.** The code contains a Menu query and a deliberate audited fallback. Exact Admin menu handles/settings remain **SHOPIFY ADMIN INVESTIGATION REQUIRED**.
3. **Custom Page templates are only partially reproducible from Page bodies.** The live Our Story and Contact templates include theme sections/forms beyond the Page body. Their structured migration remains governed by `theme-content-migration.md`.
4. **Catalog data has changed since parts of the audit.** The implementation correctly follows current Storefront API variant/options data rather than freezing previously observed counts or prices.
5. **Visual browser QA could not run in this environment.** The in-app browser runtime reported no available browser. Responsive CSS was implemented at the audited 430/700/1000/1150/1400 breakpoints and all routes were runtime-smoke-tested, but screenshot-based inspection at 375, 430, 768, 1024, and 1440 remains an explicit QA item before design sign-off.

## Validation

Completed successfully:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Local production-server HTTP smoke tests for home, collection, product, search, Page, and Policy routes.
- Rendered HTML checks for real titles, handles, prices, compare-at prices, availability, variants, and canonical URLs.

No TypeScript or lint errors are suppressed.

## Next recommended phase

First, export the exact theme homepage/logo/video/menu settings and run side-by-side responsive visual QA at 375, 430, 768, 1024, and 1440. In parallel, obtain the required Wholesale Gorilla/Admin confirmation identified in `prebuild-go-no-go.md`.

Only after the customer-aware commerce decision is documented should the next developer implement a retail Shopify Cart API layer and Shopify-hosted checkout handoff. That phase must include explicit tests proving retail pricing, discounts, GOVX routing, wholesale/customer segmentation, and checkout behavior cannot bypass one another.
